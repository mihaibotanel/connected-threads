import { Worker } from "worker_threads";
import path from "path";
import fs from "fs";
import { ThreadEvent } from "./ThreadEvent";

interface BasicFuntion {
  (...args: unknown[]): unknown;
}

abstract class Thread {
  constructor(protected args: unknown[]) {}

  abstract getWorker(): Worker;

  run(): ThreadEvent {
    return this.getWorker();
  }
}

class ScriptThread<TFn extends BasicFuntion> extends Thread {
  constructor(private fn: TFn, args: Parameters<TFn>) {
    super(args);
  }

  getWorker(): Worker {
    const script = `
    (async () => {
        await ${this.fn!(...this.args)} 
    })()
  `;
    return new Worker(script, { eval: true });
  }
}

class SourceThread extends Thread {
  constructor(private filename: string, args: unknown[]) {
    super(args);
  }

  getWorker(): Worker {
    const tsFile = path.extname(this.filename!) === ".ts";
    const script = `
      if(${tsFile}) require('ts-node').register()
      require('${this.filename}')
    `;
    return new Worker(script, { workerData: this.args, eval: true });
  }
}

export class ThreadFactory {
  static fromScript<TFn extends BasicFuntion>(fn: TFn, args: Parameters<TFn>) {
    return new ScriptThread(fn, args);
  }

  static fromSource(filename: string, args: unknown[] = []) {
    if (!fs.existsSync(filename))
      throw new Error(`ENOENT: no such file ${filename}`);
    return new SourceThread(filename, args);
  }
}
