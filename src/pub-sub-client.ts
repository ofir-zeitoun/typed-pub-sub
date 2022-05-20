import { EventEmitter } from "eventemitter3";

import { PubSubCreator } from "./types";

const commonEventEmitter = new EventEmitter();
type EventEmitterType = typeof commonEventEmitter;

type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

let counterId = 100;

export function createPubSubClient<T extends Object>(
  messages: T,
  eventEmitter: EventEmitterType = commonEventEmitter
): PubSubCreator<T> {
  return () => {
    const clientId = ++counterId;

    const ignoreMeWrapper = (callback: (payload: any) => any) => {
      return (invokerId: number, payload: any) => {
        if (invokerId === clientId) {
          return;
        }
        callback(payload);
      };
    };
    debugger;
    return (Object.entries(messages) as Entry<T>[]).reduce((acc, [messageName]) => {
      const messageTypeName =
        (messageName as string)[0].toUpperCase() + (messageName as string).substring(1);

      return {
        ...acc,
        // ...["on", "once"].reduce(
        //   (acc1, prefix) => ({
        //     ...acc1,
        //     [`${prefix}${messageTypeName}`]: (callback: (payload: any) => any) => {
        //       const handleMessage = ignoreMeWrapper(callback);
        //       eventEmitter.on(messageTypeName, handleMessage, clientId);
        //       return () => eventEmitter.removeListener(messageTypeName, handleMessage);
        //     }
        //   }),
        //   {}
        // ),
        [`on${messageTypeName}`]: (callback: (payload: any) => any) => {
          const handleMessage = ignoreMeWrapper(callback);
          eventEmitter.on(messageTypeName, handleMessage, clientId);
          return () => eventEmitter.removeListener(messageTypeName, handleMessage);
        },
        [`once${messageTypeName}`]: (callback: (payload: any) => any) => {
          const handleMessage = ignoreMeWrapper(callback);
          eventEmitter.once(messageTypeName, handleMessage, clientId);
          return () => eventEmitter.removeListener(messageTypeName, handleMessage);
        },
        [`set${messageTypeName}`]: (payload: any) => {
          eventEmitter.emit(messageTypeName, clientId, payload);
        }
      };
    }, {} as ReturnType<PubSubCreator<T>>);
  };
}
