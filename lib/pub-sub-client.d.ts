import { PubSubCreator } from "./types";
declare const commonEventEmitter: import("eventemitter3")<string | symbol, any>;
declare type EventEmitterType = typeof commonEventEmitter;
export declare function createPubSubClient<T extends Object>(messages: T, eventEmitter?: EventEmitterType): PubSubCreator<T>;
export {};
