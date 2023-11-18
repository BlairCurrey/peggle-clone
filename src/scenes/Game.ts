import * as Phaser from "phaser";
import { Ball } from "../components/Ball";
import { Pegs } from "../components/Pegs";
import { GameStateManager } from "../utils/GameStateManager";
import { HUD } from "../components/HUD";
import { AudioKey } from "../config/audio";
import { generateRandomPegs } from "../utils/generateRandomPegs";
import { Border } from "../components/Border";
import { AnyPeg } from "../components/Peg";

export class Game extends Phaser.Scene {
  private ball!: Ball;
  private pegs!: Pegs;
  private gameStateManager!: GameStateManager;

  constructor() {
    super("game");
    this.gameStateManager = new GameStateManager();
  }

  create() {
    this.sound.add(AudioKey.BACKGROUND1).play({ loop: true });

    new HUD(this);

    this.pegs = new Pegs(this, generateRandomPegs(this, 5));
    this.ball = this.spawnBall();
    new Border(this);
  }

  update() {
    if (this.ball.isOffScreen) {
      this.ball.destroy();

      if (this.pegs.getTargetPegCount() === 0) {
        // TODO: victory message, restart prompt
        alert("You won!");
        this.scene.stop();
        // this.scene.start("game");
        return;
      }

      const { ballCount } = this.gameStateManager.getState();

      if (!ballCount) {
        // TODO: lose message, restart prompt
        alert("Game over!");
        this.scene.stop();
        // this.scene.start("game");
        return;
      }

      this.ball = this.spawnBall();
    }
  }

  // TODO: make this part of the ball constructor?
  private spawnBall() {
    const ball = new Ball(this);
    this.gameStateManager.decrementBallCount();
    this.addBallPegCollision(ball);
    return ball;
  }

  private addBallPegCollision(ball: Ball) {
    const handleBallPegCollision = (ball: Ball["sprite"], peg: AnyPeg) => {
      peg.playSound();
      if (!peg.wasHit) {
        peg.wasHit = true;
        this.gameStateManager.incrementScore(peg.basePoints);
      }

      setTimeout(() => {
        this.tweens.add({
          targets: peg,
          alpha: 0, // make peg transparent
          duration: 1000, // 1 second
          onComplete: () => peg.destroy(),
        });
      }, 2000);
    };

    this.physics.add.collider(
      ball.sprite,
      this.pegs.group,
      handleBallPegCollision
    );
  }
}
