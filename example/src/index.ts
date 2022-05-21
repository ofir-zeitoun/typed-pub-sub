import { createPubSubClient } from "oz-typed-pub-sub";

const getClient = createPubSubClient({
  created: {
    by: "ofir",
    date: new Date()
  },
  send: true
});

const c1 = getClient();
const c2 = getClient();

const c1UnsubscribeCreated = c1.onCreated(console.warn);
c2.onCreated(console.error);
c2.setCreated({ by: "event", date: new Date() });
c1.setCreated({ by: "happened", date: new Date() });
c1UnsubscribeCreated();
c2.setCreated({ by: "Will not be invoked", date: new Date() });
c1.onSend(console.warn);
c2.setSend(false);

c1.onceSend((payload: boolean) => {
  console.log("payload: ", payload);
});
c2.setSend(true);
c2.setSend(false);
