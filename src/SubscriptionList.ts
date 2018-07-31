import { ISubscription } from "autobahn";

export interface ISession {
    add: (topic: string, subscription: ISubscription) => void;
    remove: (topic: string) => void;
    find: (topic: string) => ISubscription | undefined;
    getAll: () => Map<string, ISubscription>;
}
  
export abstract class SubscriptionList {
    protected subscriptionList: Map<string, ISubscription> = new Map();
    add: (topic: string, subscription: ISubscription) => void;
    remove: (topic: string) => void;
    find: (topic: string) => ISubscription | undefined;
    getAll: () => Map<string, ISubscription>;
}