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
import { functionThread } from "connected-threads";

functionThread((a: number, b: number) => a + b, [1, 3]).then((result) => {
  console.log(result);
});
```

### Using external scripts

index.ts

```javascript
import { fileThread } from "connected-threads";

const threadEvent = fileThread<number[], number>("./file.ts");

threadEvent.on("online", () => {
  console.log("online");
});

threadEvent.postMessage([1, 2, 3]);
threadEvent.postMessage([7, 4, 7]);

threadEvent.on("message", (result: number) => {
  console.log(`Sum: ${result}`);
});

threadEvent.on("close", () => {
  console.log("close");
});
```

file.ts

```javascript
import { getParentThread } from "connected-threads";

const parent = getParentThread<number, number[]>();

parent.on("message", (array: number[]) => {
  parent.postMessage(array.reduce((sum, val) => sum + val));
});
```