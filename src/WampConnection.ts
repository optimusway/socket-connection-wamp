import autobahn, { Connection, IConnectionOptions, Session } from "autobahn";
import { IProxy } from "socket-connection";
import { WampMessageType } from "./models/WampMessageType";
import { hashCode } from "./utils/string";
import {
  ISubscriptionList,
  WampSubscriptionList
} from "./WampSubscriptionList";

export interface IWampMessageOptions {
  type: WampMessageType;
  topic?: string;
  callback?: any;
}

export class WampConnection implements IProxy {
  private subscriptionList: ISubscriptionList;
  private session: Session;
  private isAlive: boolean = false;
  private connection: Connection;
  private options: IConnectionOptions;

  constructor(options: IConnectionOptions) {
    this.subscriptionList = new WampSubscriptionList();
    this.options = options;
  }

  connect = () => {
    return new Promise(resolve => {
      if (this.session) {
        console.info("Already connected");
        this.isAlive = true;
        resolve();
      }

      this.connection = new autobahn.Connection(this.options);

      this.connection.onopen = (autobahnSession: Session) => {
        this.isAlive = true;
        this.session = autobahnSession;
        resolve();
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

  close = async () => {
    await this.unsubscribeFromAll();
    return this.connection.close();
  };

  send = ({ topic, type, callback }: IWampMessageOptions): Promise<any> => {
    switch (type) {
      case WampMessageType.Subscribe:
        return this.subscribe(topic!, callback);

      case WampMessageType.Unsubscribe:
        return this.unsubscribe(topic!, callback);

      case WampMessageType.SubscribeToAll:
        return this.subscribeToAll();

      case WampMessageType.UnsubscribeFromAll:
        return this.unsubscribeFromAll();

      case WampMessageType.GetAllSubscriptions:
        return new Promise(resolve => {
          resolve(this.getAllSubscriptions());
        });

      case WampMessageType.GetSubscription:
        return new Promise(resolve => {
          resolve(this.getSubscription(topic!, callback));
        });
    }
    return new Promise(this.catchUnknownType);
  };

  isConnected = () => this.isAlive;

  private subscribe = async (topic: string, callback: any) => {
    const subscription = await this.session.subscribe(topic, callback);
    const key = hashCode(`${topic}${callback.toString()}`);
    this.subscriptionList.add(key, subscription);
    return subscription;
  };

  private unsubscribe = async (topic: string, callback: any) => {
    const key = hashCode(`${topic}${callback.toString()}`);
    const subscription = this.subscriptionList.find(key);
    if (!subscription) {
      return Promise.reject(`${topic} is not initialized`);
    }
    await subscription!.unsubscribe();
    this.subscriptionList.remove(key);
    return Promise.resolve();
  };

  private unsubscribeFromAll = () => {
    const unsubscriptionPromises: any[] = [];
    this.subscriptionList
      .getAll()
      .forEach(subscription =>
        unsubscriptionPromises.push(
          this.unsubscribe(subscription.topic, subscription.handler)
        )
      );
    return Promise.all(unsubscriptionPromises);
  };

  private subscribeToAll = () => {
    const subscriptionPromises: any[] = [];
    this.subscriptionList
      .getAll()
      .forEach(subscription =>
        subscriptionPromises.push(
          this.subscribe(subscription.topic, subscription.handler)
        )
      );
    return Promise.all(subscriptionPromises);
  };

  private getAllSubscriptions = () => this.subscriptionList.getAll();
  private getSubscription = (topic: string, callback: any) =>
    this.subscriptionList.find(hashCode(`${topic}${callback.toString()}`));

  private catchUnknownType = () => `You've sent unknown type of message`;
}
