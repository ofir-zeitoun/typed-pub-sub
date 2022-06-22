type HandlerType<T> = (message: T, next: () => void) => undefined | unknown;

export function createMessageHandler<T>() {
  const subscribers = new Set<HandlerType<T>>();

  return {
    subscribe(cb: HandlerType<T>): () => void {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },

    handle(message: T): undefined | unknown {
      let res: unknown = undefined;
      for (const handler of Array.from(subscribers)) {
        let stopLoop = true;
        function next() {
          stopLoop = false;
        }
        res = handler(message, next);
        if (res !== undefined && stopLoop) {
          break;
        }
      }
      return res;
    }
  };
}
