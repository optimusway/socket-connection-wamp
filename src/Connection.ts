import { Session, Connection, IConnectionOptions, ISubscription } from "autobahn";
import { IWampSubscriptionConfig } from "./Subscription";
import { ISession } from "./SubscriptionList";

export abstract class WebSocketConnection {
  protected session: Session;
  protected connection: Connection;
  protected subscriptionList: ISession;
  protected isConnected: boolean = false;

  sub: (options: IConnectionOptions) => Promise<Session>;
  zero: () => void;
  subscribeToTopic: (config: IWampSubscriptionConfig) => Promise<any>;
  unsubscribeFromTopic: (subscription: ISubscription) => void;
  subscribeToAllTopics: () => void;
}