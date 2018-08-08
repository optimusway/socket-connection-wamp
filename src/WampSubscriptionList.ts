import { ISubscription } from "autobahn";

export interface ISubscriptionList {
  add: (id: string, subscription: ISubscription, topic: string) => void;
  remove: (id: string) => void;
  find: (id: string) => IWampSubscriptionItem | undefined;
  getAll: () => IWampSubscriptionItem[];
}

export interface IWampSubscriptionItem {
  id: string;
  topic: string;
  subscription: ISubscription;
}

export class WampSubscriptionList implements ISubscriptionList {
  private subscriptionList: IWampSubscriptionItem[] = [];

  add = (
    id: string,
    subscription: ISubscription,
    topic: string
  ): IWampSubscriptionItem => {
    const subscriptionItem = {
      id,
      subscription,
      topic
    };
    this.subscriptionList.push(subscriptionItem);
    return subscriptionItem;
  };

  remove = (id: string) => {
    this.subscriptionList = this.subscriptionList.filter(
      subscription => subscription.id !== id
    );
  };

  find = (id: string): IWampSubscriptionItem | undefined =>
    this.subscriptionList.find(subscription => subscription.id === id);

  getAll = (): IWampSubscriptionItem[] => this.subscriptionList;
}
