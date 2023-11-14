// Can use Phaser.Events.EventEmitter if deeper integration required or my EventEmitter becomes hard to extend.

import { EventEmitter, Event } from "./EventEmitter";

interface GameState {
  ballCount: number;
  score: number;
}

/**
 * @classdesc A singleton game state manager
 */
export class GameStateManager extends EventEmitter {
  private static instance?: GameStateManager;
  private state!: GameState;

  private defaultState: GameState = {
    ballCount: 3,
    score: 0,
  };

  constructor() {
    if (GameStateManager.instance) {
      return GameStateManager.instance;
    }
    super();
    this.state = this.defaultState;

    GameStateManager.instance = this;
  }

  getState() {
    return { ...this.state }; // copy to avoid external modification
  }

  incrementBallCount() {
    this.state.ballCount++;
    this.publish(Event.BALL_COUNT_CHANGE, this.state.ballCount);
  }

  decrementBallCount() {
    if (!this.state.ballCount) {
      throw new Error("Ball count cannot be negative");
    }
    this.state.ballCount--;
    this.publish(Event.BALL_COUNT_CHANGE, this.state.ballCount);
  }

  incrementScore(amount: number) {
    if (amount <= 0) {
      throw new Error("Score must be incremented by a positive amount");
    }

    this.state.score += amount;
    this.publish(Event.SCORE_CHANGE, this.state.score);
  }
}
