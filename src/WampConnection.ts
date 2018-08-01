import autobahn, {
  Connection,
  IConnectionOptions,
  ISubscription,
  Session
} from "autobahn";
import { IProxy } from "socket-connection/dist/socket";
import { IWampSubscriptionConfig } from "./Subscription";
import { SubscriptionList } from "./SubscriptionList";
import WampSession from "./WampSubscriptionList";

class WampConnection implements IProxy {
  private subscriptionList: SubscriptionList;
  private session: Session;
  private isConnected: boolean = false;
  private connection: Connection;
  private options: IConnectionOptions;

  constructor(options: IConnectionOptions) {
    this.subscriptionList = new WampSession();
    this.options = options;
  }

  connect = (): Promise<Session> => {
    return new Promise<Session>(resolve => {
      if (this.session) {
        console.info("Connected");
        this.isConnected = true;
        resolve(this.session);
      }

      this.connection = new autobahn.Connection(this.options);

      this.connection.onopen = (autobahnConnection: Session) => {
        this.isConnected = true;
        this.session = autobahnConnection;
        resolve(this.session);
      };

      this.connection.onclose = (reason: string, details: any) => {
        this.isConnected = false;
        if (reason === "details") {
          console.warn("Connection closed");
        } else {
          console.error(
            `Connection lost, details: [${JSON.stringify(details)}]`
          );
        }
        return true;
      };

      console.info("Connected");
      this.connection.open();
    });
  };

  close = () => {
    this.unsubscribeFromAllTopics();
    this.connection.close();
  };

  subscribeToTopic = async ({
    topic,
    callback
  }: IWampSubscriptionConfig): Promise<ISubscription> => {
    const subscription = await this.session.subscribe(topic, callback);
    this.subscriptionList.add(topic, subscription);
    return subscription;
  };

  unsubscribeFromTopic = async (subscription: ISubscription) => {
    const topic = subscription.topic;
    await this.subscriptionList.find(topic)!.unsubscribe();
    this.subscriptionList.remove(topic);
  };

  unsubscribeFromAllTopics = () =>
    this.subscriptionList.getAll().forEach(this.unsubscribeFromTopic);

  subscribeToAllTopics = () =>
    this.subscriptionList.getAll().forEach(subscription =>
      this.subscribeToTopic({
        callback: this.subscriptionList.find(subscription.topic)!.handler,
        topic: subscription.topic
      })
    );
}

export default WampConnection;
