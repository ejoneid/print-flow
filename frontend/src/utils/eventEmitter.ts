export class EventEmitter {
  events: Record<string, ((data: unknown) => void)[]>;
  constructor() {
    this.events = {};
  }

  on(event: string, listener: (data: unknown | undefined) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, data?: unknown) {
    const listeners = this.events[event];
    if (listeners) {
      for (const listener of listeners) {
        listener(data);
      }
    }
  }
}

export const globalEventEmitter = new EventEmitter();
