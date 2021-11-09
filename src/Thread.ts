import { Worker } from "worker_threads";

export class Thread {
  private filename?: Readonly<string>;
  private fn?: Readonly<Function>;
  private args: Readonly<any[]>;

  constructor(filename: string, ...args: any);
  constructor(fn: Function, ...args: any);
  constructor(script: string | Function, ...args: any[]) {
    if (typeof script === "string") this.filename = script;
    else this.fn = script;
    this.args = args;
  }

  private getFileWorker(): Worker {
    return new Worker(this.filename!);
  }

  private getScriptWorker(): Worker {
    const script = `
        (async () => {
            await ${this.fn!(...this.args)} 
        })()
    `;
    return new Worker(script, { eval: true });
  }

  async run(): Promise<void> {
    new Promise((resolve, reject) => {
        const worker = this.filename ? this.getFileWorker() : this.getScriptWorker();
        worker.once("online", () => {
            console.log("online");   
        })
        worker.once("message", resolve)
        worker.once("error", reject)
    })
  }
}
