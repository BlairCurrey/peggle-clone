export enum Event {
  SCORE_CHANGE = "score_change",
  BALL_COUNT_CHANGE = "ball_count_change",
}

interface Subscribers {
  [eventName: string]: Function[];
}

export class EventEmitter {
  private subscribers: Subscribers;

  constructor() {
    this.subscribers = {};
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
