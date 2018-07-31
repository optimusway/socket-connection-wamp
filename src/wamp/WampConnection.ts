import autobahn, {
  IConnectionOptions, ISubscription,
  Session
} from 'autobahn';
import WampSession from "./WampSubscriptionList";
import { WebSocketConnection } from '../connection/Connection';
import { IWampSubscriptionConfig } from '../connection/Subscription';

class WampConnection extends WebSocketConnection{

  constructor() {
    super();
    this.subscriptionList = new WampSession();
  }

  sub = (options: IConnectionOptions): Promise<Session> => {

    return new Promise<Session>(resolve => {
      if (this.session) {
        console.info('Connected');
        this.isConnected = true;
        resolve(this.session);
      }

      this.connection = new autobahn.Connection(options);

      this.connection.onopen = (autobahnConnection: Session) => {
        this.isConnected = true;
        this.session = autobahnConnection;
        resolve(this.session);
      };

      this.connection.onclose = (reason: string, details: any) => {
        this.isConnected = false;
        if (reason === 'details') {
          console.warn('Connection closed')
        } else {
          console.error(`Connection lost, details: [${JSON.stringify(details)}]`);
        }
        return true;
      };

      console.info('Connected');
      this.connection.open();
    });

  };

  zero = () => {
    this.unsubscribeFromAllTopics();
    this.connection.close();
  };

  subscribeToTopic = async({topic, callback}: IWampSubscriptionConfig): Promise<ISubscription> => {
    const subscription = await this.session.subscribe(topic, callback);
    this.subscriptionList.add(topic, subscription);
    return subscription;
  };

  unsubscribeFromTopic = async(subscription: ISubscription) => {
    const topic = subscription.topic;
    await this.subscriptionList.find(topic)!.unsubscribe();
    this.subscriptionList.remove(topic);
  };

  unsubscribeFromAllTopics = () => this.subscriptionList.getAll().forEach(this.unsubscribeFromTopic);

  subscribeToAllTopics = () => this.subscriptionList.getAll().forEach(subscription =>
    this.subscribeToTopic({
      topic: subscription.topic,
      callback: this.subscriptionList.find(subscription.topic)!.handler
    })
  );

}

export default new WampConnection();