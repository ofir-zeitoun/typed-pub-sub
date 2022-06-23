import { createMessageHandler, createPubSubClient } from "oz-typed-pub-sub";

const getClient = createPubSubClient({
  message: {
    by: "",
    id: 0
  }
});

const c1 = getClient();
const c2 = getClient();

const c1UnsubscribeMessage = c1.onMessage(payload => {
  console.log(`C1 handler: ${payload.by} #${payload.id}`);
});

c2.onMessage(payload => {
  console.log(`C2 handler: ${payload.by} #${payload.id}`);
});

c1.setMessage({ by: "c1", id: 1 });
c2.setMessage({ by: "c2", id: 2 });

c1UnsubscribeMessage();
c2.setMessage({ by: "c2", id: 3 }); // will not be handled

c1.onceMessage(payload => {
  console.log(`C1 handler (once): ${payload.by} #${payload.id}`);
});

c2.setMessage({ by: "c2", id: 4 });
c2.setMessage({ by: "c2", id: 5 }); // will not be handled

console.log();

const handlers = createMessageHandler<string>();

const unSubHandleA = handlers.subscribe((s, next) => {
  next(); // keep this value, but if other handler have value, override it
  return s.startsWith("a") ? "A" : undefined;
});
const unSubHandle5 = handlers.subscribe(s => (s.length === 5 ? 5 : undefined));

console.log("handlers: ");
const res = handlers.publish("aaaaa");
console.log("res: ", res);
