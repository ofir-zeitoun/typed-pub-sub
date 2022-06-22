"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageHandler = void 0;
function createMessageHandler() {
    const subscribers = new Set();
    return {
        subscribe(cb) {
            subscribers.add(cb);
            return () => {
                subscribers.delete(cb);
            };
        },
        handle(message) {
            let res = undefined;
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
        },
        toString() {
            return `MessageHandler [${subscribers.size}]`;
        }
    };
}
exports.createMessageHandler = createMessageHandler;
