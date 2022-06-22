declare type HandlerType<T> = (message: T, next: () => void) => undefined | unknown;
export declare function createMessageHandler<T>(): {
    subscribe(cb: HandlerType<T>): () => void;
    handle(message: T): undefined | unknown;
};
export {};
