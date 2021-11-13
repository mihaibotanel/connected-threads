import { EventEmitter } from "events";

interface IPublisher {
  message: (payload: { [key: string]: any }) => void;
  terminate: () => void;
}

interface ISubscriber {
  data: (payload: { [key: string]: any }) => void;
  online: () => void;
  error: (error: string) => void;
  close: () => void;
}

export class ThreadEvent extends EventEmitter {
  public emit = <K extends keyof IPublisher>(
    event: K,
    ...args: Parameters<IPublisher[K]>
  ): boolean => {
    return super.emit(event, ...args);
  };
  public on = <K extends keyof ISubscriber>(
    event: K,
    listener: ISubscriber[K]
  ): this => {
    return super.on(event, listener);
  };
}