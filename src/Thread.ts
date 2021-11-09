import { Worker } from "worker_threads";

interface ArrowFuntion {
  (...args: any): any
}

export class Thread<TFn extends ArrowFuntion = ArrowFuntion> {
  private fn?: TFn;
  private filename?: Readonly<string>;
  private args: Readonly<Array<any>>;

  constructor(fn: TFn, args: Parameters<TFn>);
  constructor(filename: string, args: Array<any>);
  constructor(script: TFn | string, args: Array<any>) {
    if (typeof script === "string") this.filename = script;
    else this.fn = script;
    this.args = args;
  }

  private getFileWorker(): Worker {
    return new Worker(this.filename!, {workerData: this.args});
  }

  private getScriptWorker(): Worker {
    const script = `
        (async () => {
            await ${this.fn!(...this.args)} 
        })()
    `;
    return new Worker(script, { eval: true });
  }

  async run() {
    return new Promise((resolve, reject) => {
        const worker = this.filename ? this.getFileWorker() : this.getScriptWorker();
        worker.on("online", () => {
            console.log("online");   
        })
        worker.once("message", (data) => {
            console.log('data' + data)
        })
        worker.once("error", reject)
        worker.once('exit', resolve)
    })
  }
}
