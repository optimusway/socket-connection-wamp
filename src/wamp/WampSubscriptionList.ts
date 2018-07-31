import {ISubscription} from "autobahn";
import { SubscriptionList } from "../connection/SubscriptionList";

class WampSubscriptionList extends SubscriptionList{
  add = (topic: string, subscription: ISubscription) => {
    this.subscriptionList.set(topic, subscription);
  };

  remove = (topic: string) => {
    this.subscriptionList.delete(topic);
  };

  find = (topic: string): ISubscription | undefined => this.subscriptionList.get(topic);

  getAll = (): Map<string, ISubscription> => this.subscriptionList;

}

export default WampSubscriptionList;