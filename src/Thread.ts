import path from "path";
import { Worker, isMainThread, parentPort } from "worker_threads";
import { ThreadEmitter } from "./ThreadEmitter";

interface BasicFuntion {
  (...args: unknown[]): unknown;
}

export function functionThread<TFn extends BasicFuntion>(
  fn: TFn,
  args: Parameters<TFn>
): Promise<ReturnType<TFn>> {
  if (!isMainThread) {
    throw new Error("This function is intended to be called only from the main thread.");
  }

  const script = `
        (async () => {
            const { parentPort, workerData } = require('worker_threads');
            const args = workerData;
            const result = await (${fn})(...args);
            parentPort.postMessage(result);
        })();
  `;

  const worker = new Worker(script, { eval: true, workerData: args });

  return new Promise((resolve, reject) => {
    worker.on("message", (value: ReturnType<TFn>) => resolve(value));
    worker.on("error", (err) => reject(err));
  });
}

export function fileThread<TPub, TSub>(
  filename: string
): ThreadEmitter<TPub, TSub> {
  if (!isMainThread) {
    throw new Error("This function is intended to be called only from the main thread.");
  }

  const isTsFile = path.extname(filename!) === ".ts";
  const script = `
        if(${isTsFile}) {
            require('ts-node').register()
        }
        require('${filename}')
  `;

  const worker = new Worker(script, { eval: true });
  return new ThreadEmitter<TPub, TSub>(worker);
}

export function getParentThread<TPub, TSub>(): ThreadEmitter<TPub, TSub> {
  if (isMainThread || !parentPort) {
    throw new Error("The current thread is not a worker thread");
  }
  return new ThreadEmitter<TPub, TSub>(parentPort);
}
