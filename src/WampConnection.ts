import autobahn, {
  Connection,
  IConnectionOptions,
  ISubscription,
  Session
} from "autobahn";
import { IProxy } from "socket-connection/dist/socket";
import { SubscriptionList } from "./SubscriptionList";
import WampSession from "./WampSubscriptionList";

class WampConnection implements IProxy {
  private subscriptionList: SubscriptionList;
  private session: Session;
  private isAlive: boolean = false;
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
        this.isAlive = true;
        resolve(this.session);
      }

      this.connection = new autobahn.Connection(this.options);

      this.connection.onopen = (autobahnConnection: Session) => {
        this.isAlive = true;
        this.session = autobahnConnection;
        resolve(this.session);
      };

      this.connection.onclose = (reason: string, details: any) => {
        this.isAlive = false;
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
    this.unsubscribeFromAll();
    this.connection.close();
  };

  subscribe = async (topic: string, callback: any): Promise<ISubscription> => {
    const subscription = await this.session.subscribe(topic, callback);
    this.subscriptionList.add(topic, subscription);
    return subscription;
  };

  unsubscribe = async (topic: string) => {
    await this.subscriptionList.find(topic)!.unsubscribe();
    this.subscriptionList.remove(topic);
  };

  unsubscribeFromAll = () =>
    this.subscriptionList
      .getAll()
      .forEach(subscription => this.unsubscribe(subscription.topic));

  subscribeToAll = () =>
    this.subscriptionList
      .getAll()
      .forEach(subscription =>
        this.subscribe(
          subscription.topic,
          this.subscriptionList.find(subscription.topic)!.handler
        )
      );

  getAllSubscribes = () => this.subscriptionList.getAll();
  isConnected = () => this.isAlive;
}

export default WampConnection;
