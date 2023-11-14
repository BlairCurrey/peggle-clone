export enum Event {
  SCORE_CHANGE = "score_change",
  BALL_COUNT_CHANGE = "ball_count_change",
}

interface Subscribers {
  [eventName: string]: Function[];
}

/**
 * @classdesc A singleton event emitter
 */
export class EventEmitter {
  private static instance?: EventEmitter;
  private subscribers: Subscribers;

  constructor() {
    if (EventEmitter.instance) {
      return EventEmitter.instance;
    }

    this.subscribers = {};

    EventEmitter.instance = this;
  }

  subscribe(eventName: Event, callback: Function) {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }
    this.subscribers[eventName].push(callback);
  }

  publish(eventName: Event, data: any) {
    if (this.subscribers[eventName]) {
      this.subscribers[eventName].forEach((callback) => callback(data));
    }
  }
}
