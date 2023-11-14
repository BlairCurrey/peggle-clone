// TODO: Phaser has a StateManager and EventEmitter. Consider using those?

import { EventEmitter, Event } from "./EventEmitter";

interface GameState {
  ballCount: number;
  score: number;
}

/**
 * @classdesc A singleton game state manager
 */
export class GameStateManager {
  private static instance?: GameStateManager;
  private state!: GameState;
  private eventEmitter!: EventEmitter;

  private defaultState: GameState = {
    ballCount: 3,
    score: 0,
  };

  constructor() {
    if (GameStateManager.instance) {
      return GameStateManager.instance;
    }

    this.state = this.defaultState;
    this.eventEmitter = new EventEmitter();

    GameStateManager.instance = this;
  }

  incrementBallCount() {
    this.state.ballCount++;
    this.eventEmitter.publish(Event.BALL_COUNT_CHANGE, this.state.ballCount);
  }

  decrementBallCount() {
    if (!this.state.ballCount) {
      throw new Error("Ball count cannot be negative");
    }
    this.state.ballCount--;
    this.eventEmitter.publish(Event.BALL_COUNT_CHANGE, this.state.ballCount);
  }

  incrementScore(amount: number) {
    if (amount <= 0) {
      throw new Error("Score must be incremented by a positive amount");
    }

    this.state.score += amount;
    this.eventEmitter.publish(Event.SCORE_CHANGE, this.state.score);
  }

  // reset() {
  //   this.state = this.defaultState;
  //   console.log(this.state);
  //   // this.eventEmitter.publish("ballsLeftChanged", this.state.ballCount);
  //   // this.eventEmitter.publish("scoreChanged", this.state.score);
  // }

  getState() {
    return { ...this.state }; // Return a copy to avoid external modification
  }

  subscribe(event: Event, callback: Function) {
    this.eventEmitter.subscribe(event, callback);
  }

  publish(event: Event, data: any) {
    this.eventEmitter.publish(event, data);
  }

  // unsubscribe(event: Event, callback) {
  //   this.eventEmitter.unsubscribe(eventName, callback);
  // }
}

// export enum Event {
//   SCORE_CHANGE = "score_change",
//   BALL_COUNT_CHANGE = "ball_count_change",
// }

// interface Subscribers {
//   [eventName: string]: Function[];
// }

// /**
//  * @classdesc A singleton event emitter
//  */
// class EventEmitter {
//   private static instance?: EventEmitter;
//   private subscribers: Subscribers;

//   constructor() {
//     if (EventEmitter.instance) {
//       return EventEmitter.instance;
//     }

//     this.subscribers = {};

//     EventEmitter.instance = this;
//   }

//   subscribe(eventName: Event, callback: Function) {
//     if (!this.subscribers[eventName]) {
//       this.subscribers[eventName] = [];
//     }
//     this.subscribers[eventName].push(callback);
//   }

//   publish(eventName: Event, data: any) {
//     if (this.subscribers[eventName]) {
//       this.subscribers[eventName].forEach((callback) => callback(data));
//     }
//   }
// }
