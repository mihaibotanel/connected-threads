import { Worker, MessagePort } from "worker_threads";

interface ISubscriber<TSub> {
  message: (payload: TSub) => void;
  online: () => void;
  error: (error: string) => void;
  close: () => void;
}

export class ThreadEmitter<TPub, TSub> {
  constructor(private thread: Worker | MessagePort) {}

  public on = <K extends keyof ISubscriber<TSub>>(
    event: K,
    listener: ISubscriber<TSub>[K]
  ): this => {
    this.thread.on(event, listener);
    return this;
  };

  public postMessage = (payload: TPub): void => {
    return this.thread.postMessage(payload);
  };

  public close = (): void => {
    if (this.thread instanceof Worker) this.thread.terminate();
    else this.thread.close();
  };
}
