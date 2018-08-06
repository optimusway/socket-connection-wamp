import { ISubscription } from "autobahn";

export interface ISubscriptionList {
  add: (key: number, subscription: ISubscription) => void;
  remove: (key: number) => void;
  find: (key: number) => ISubscription | undefined;
  getAll: () => Map<number, ISubscription>;
}

export class WampSubscriptionList implements ISubscriptionList {
  private subscriptionList: Map<number, ISubscription> = new Map();

  add = (key: number, subscription: ISubscription) => {
    this.subscriptionList.set(key, subscription);
  };

  remove = (key: number) => {
    this.subscriptionList.delete(key);
  };

  find = (key: number): ISubscription | undefined =>
    this.subscriptionList.get(key);

  getAll = (): Map<number, ISubscription> => this.subscriptionList;
}
