import { ISubscription } from "autobahn";

export interface ISubscriptionList {
  add: (topic: string, subscription: ISubscription) => void;
  remove: (topic: string) => void;
  find: (topic: string) => ISubscription | undefined;
  getAll: () => Map<string, ISubscription>;
}

export class WampSubscriptionList implements ISubscriptionList {
  private subscriptionList: Map<string, ISubscription> = new Map();

  add = (topic: string, subscription: ISubscription) => {
    this.subscriptionList.set(topic, subscription);
  };

  remove = (topic: string) => {
    this.subscriptionList.delete(topic);
  };

  find = (topic: string): ISubscription | undefined =>
    this.subscriptionList.get(topic);

  getAll = (): Map<string, ISubscription> => this.subscriptionList;
}
