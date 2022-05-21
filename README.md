# typed-pub-sub

Typed Pub/Sub with EventEmitter.

It creates clients with typed schema, so clients can communicate on 'agreed' messages.

## Install

`npm i oz-typed-pub-sub`

## Usage

```ts
import { createPubSubClient } from "oz-typed-pub-sub";

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

// output:
// C2 handler: c1 #1
// C1 handler: c2 #2
// C1 handler (once): c2 #4
```
