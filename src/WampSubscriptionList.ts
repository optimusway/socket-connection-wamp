import { ISubscription } from "autobahn";

export interface ISubscriptionList {
  add: (id: number, subscription: ISubscription) => void;
  remove: (id: number) => void;
  find: (id: number) => ISubscription | undefined;
  getAll: () => Map<number, ISubscription>;
}

export class WampSubscriptionList implements ISubscriptionList {
  private subscriptionList: Map<number, ISubscription> = new Map();

  add = (id: number, subscription: ISubscription) => {
    this.subscriptionList.set(id, subscription);
  };

  remove = (id: number) => {
    this.subscriptionList.delete(id);
  };

  find = (id: number): ISubscription | undefined =>
    this.subscriptionList.get(id);

  getAll = (): Map<number, ISubscription> => this.subscriptionList;
}
