import { IProxy } from "@lykkex/subzero";
import autobahn, { Connection, IConnectionOptions, Session } from "autobahn";
import { WampMessageType } from "./models/WampMessageType";
import {
  ISubscriptionList,
  WampSubscriptionList
} from "./WampSubscriptionList";

// tslint:disable-next-line:no-var-requires
const uniqid = require("uniqid");

export interface IWampMessageOptions {
  type: WampMessageType;
  topic?: string;
  callback?: () => void;
  id?: string;
}

export class WampConnection implements IProxy {
  private subscriptionList: ISubscriptionList;
  private session: Session | null;
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
        console.info("Connected");
        resolve();
      };

      this.connection.onclose = (reason: string, details: any) => {
        this.isAlive = false;
        this.session = null;
        if (reason === "details") {
          console.warn("Connection closed");
        } else {
          console.error(
            `Connection lost, details: [${JSON.stringify(details)}]`
          );
        }
        return true;
      };

      this.connection.open();
    });
  };

  close = async () => {
    await this.unsubscribeFromAll();
    return this.connection.close();
  };

  send = ({ topic, type, callback, id }: IWampMessageOptions): Promise<any> => {
    switch (type) {
      case WampMessageType.Subscribe:
        return this.subscribe(topic!, callback);

      case WampMessageType.Unsubscribe:
        return this.unsubscribe(topic!, id!);

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
          resolve(this.getSubscription(id!));
        });
    }
    return new Promise(this.catchUnknownType);
  };

  isConnected = () => this.isAlive;

  private subscribe = async (topic: string, callback: any) => {
    const subscription = await this.session!.subscribe(topic, callback);
    const id = uniqid();
    const subscriptionItem = this.subscriptionList.add(id, subscription, topic);
    return Promise.resolve(subscriptionItem);
  };

  private unsubscribe = async (topic: string, id: string) => {
    const subscriptionItem = this.subscriptionList.find(id);
    if (!subscriptionItem) {
      return Promise.reject(`${topic} is not initialized`);
    }
    await subscriptionItem!.subscription.unsubscribe();
    this.subscriptionList.remove(id);
    return Promise.resolve();
  };

  private unsubscribeFromAll = () => {
    const unsubscriptionPromises: any[] = [];
    this.subscriptionList
      .getAll()
      .forEach(subscriptionItem =>
        unsubscriptionPromises.push(
          this.unsubscribe(subscriptionItem.topic, subscriptionItem.id)
        )
      );
    return Promise.all(unsubscriptionPromises);
  };

  private subscribeToAll = () => {
    const subscriptionPromises: any[] = [];
    this.subscriptionList
      .getAll()
      .forEach(subscriptionItem =>
        subscriptionPromises.push(
          this.subscribe(
            subscriptionItem.topic,
            subscriptionItem.subscription.handler
          )
        )
      );
    return Promise.all(subscriptionPromises);
  };

  private getAllSubscriptions = () => this.subscriptionList.getAll();
  private getSubscription = (id: string) => this.subscriptionList.find(id);

  private catchUnknownType = () => `You've sent unknown type of message`;
}
