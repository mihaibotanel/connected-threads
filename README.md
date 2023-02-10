# Connected Threads

Library that allows you to run scripts or other files on separate threads. It uses workers for managing threads, improving the performance of your applications and avoiding blocking the main thread. It has a user-friendly API, that makes it easy to create and manage threads and communicate between them.

## Installation

```
# npm
npm i connected-threads

# yarn
yarn add connected-threads
```

## Usage

### Using functions

```javascript
import { Thread } from "connected-threads";

const thread = new Thread((x: number, y: number) => console.log(x + y), [2, 3]);
thread.run();
```

### Using external scripts

index.ts

```javascript
import { Thread } from "connected-threads";

const thread = new Thread("./file.ts");
const threadEvent = thread.run();

threadEvent.on("data", (payload: Object) => {
  console.log(payload);
});
threadEvent.on("online", () => {
  console.log("online");
});
threadEvent.on("close", () => {
  console.log("close");
});
threadEvent.emit("message", { name: "threads" });
```

file.ts

```javascript
import { parentPort } from "worker_threads";

if (parentPort) {
  parentPort.on("message", (message: Object) => {
    console.log(message);
  });
  parentPort.postMessage("Message 1");
  parentPort.postMessage("Message 2");
}
```