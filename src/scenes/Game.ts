import * as Phaser from "phaser";
import { Ball } from "../components/Ball";
import { Pegs } from "../components/Pegs";
import { GameStateManager } from "../utils/GameStateManager";
import { HUD } from "../components/HUD";
import { AudioKey } from "../config/audio";
import { generateRandomPegs } from "../utils/generateRandomPegs";
import { Border } from "../components/Border";

export class Game extends Phaser.Scene {
  private ball!: Ball;
  private pegs!: Pegs;
  private gameStateManager!: GameStateManager;
  private pegHitSound!: Phaser.Sound.BaseSound;

  constructor() {
    super("game");
    this.gameStateManager = new GameStateManager();
  }

  create() {
    this.sound.add(AudioKey.BACKGROUND1).play({ loop: true });
    this.pegHitSound = this.sound.add(AudioKey.BLASTER3);

    new HUD(this);

    this.pegs = new Pegs(this, generateRandomPegs(this, 5));
    this.ball = this.spawnBall();
    new Border(this);
  }

  update() {
    if (this.ball.isOffScreen) {
      this.ball.destroy();

      if (!this.pegs.group.getLength()) {
        // TODO: victory screen
        alert("You won!");
        this.scene.stop();
        // this.scene.start("game");
        return;
      }

      const { ballCount } = this.gameStateManager.getState();

      if (!ballCount) {
        // TODO: game over screen
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
    const handleBallPegCollision = (ballSprite, pegSprite) => {
      this.pegHitSound.play({ rate: 5 });
      // TODO: add to score depending on peg type
      if (!pegSprite.getData("wasHit")) {
        pegSprite.setData("wasHit", true);
        this.gameStateManager.incrementScore(100);
      }

      setTimeout(() => {
        this.tweens.add({
          targets: pegSprite,
          alpha: 0, // make peg transparent
          duration: 1000, // 1 second
          onComplete: () => pegSprite.destroy(),
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
