import { EventEmitter } from "events";

interface IPublisher<TPub> {
  message: (payload: TPub) => void;
  terminate: () => void;
}

interface ISubscriber<TSub> {
  data: (payload: TSub) => void;
  online: () => void;
  error: (error: string) => void;
  close: () => void;
}

export class ThreadEvent<TPub, TSub> extends EventEmitter {
  public emit = <K extends keyof IPublisher<TPub>>(
    event: K,
    ...args: Parameters<IPublisher<TPub>[K]>
  ): boolean => {
    return super.emit(event, ...args);
  };
  public on = <K extends keyof ISubscriber<TSub>>(
    event: K,
    listener: ISubscriber<TSub>[K]
  ): this => {
    return super.on(event, listener);
  };
}
