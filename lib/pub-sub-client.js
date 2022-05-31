"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPubSubClient = void 0;
const eventemitter3_1 = require("eventemitter3");
const commonEventEmitter = new eventemitter3_1.EventEmitter();
let counterId = 100;
function createPubSubClient(messages, eventEmitter = commonEventEmitter) {
    return () => {
        const clientId = ++counterId;
        const ignoreMeWrapper = (callback) => {
            return (invokerId, payload) => {
                if (invokerId === clientId) {
                    return;
                }
                callback(payload);
            };
        };
        return Object.entries(messages).reduce((acc, [messageName]) => {
            const messageTypeName = messageName[0].toUpperCase() + messageName.substring(1);
            return {
                ...acc,
                [`on${messageTypeName}`]: (callback) => {
                    const handleMessage = ignoreMeWrapper(callback);
                    eventEmitter.on(messageTypeName, handleMessage, clientId);
                    return () => eventEmitter.removeListener(messageTypeName, handleMessage);
                },
                [`once${messageTypeName}`]: (callback) => {
                    const handleMessage = ignoreMeWrapper(callback);
                    eventEmitter.once(messageTypeName, handleMessage, clientId);
                    return () => eventEmitter.removeListener(messageTypeName, handleMessage);
                },
                [`set${messageTypeName}`]: (payload) => {
                    eventEmitter.emit(messageTypeName, clientId, payload);
                }
            };
        }, {});
    };
}
exports.createPubSubClient = createPubSubClient;
