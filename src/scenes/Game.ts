import * as Phaser from "phaser";
import { Ball } from "../components/Ball";
import { Pegs } from "../components/Pegs";
import { Image } from "../utils/images";
import { GameStateManager } from "../utils/GameStateManager";
import { HUD } from "../components/HUD";
import { Audio } from "../utils/audio";
import { generateRandomPegs } from "../utils/generateRandomPegs";

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
    this.sound.add(Audio.BACKGROUND1).play({ loop: true });
    this.pegHitSound = this.sound.add(Audio.BLASTER3);

    new HUD(this);

    this.pegs = new Pegs(this, generateRandomPegs(this, 5, Image.ORB));
    this.spawnBall();
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

      this.spawnBall();
    }
  }

  private spawnBall() {
    this.ball = new Ball(this);
    this.gameStateManager.decrementBallCount();
    this.addBallPegCollision();
  }

  private addBallPegCollision() {
    const handleBallPegCollision = (ballSprite, pegSprite) => {
      this.pegHitSound.play({ rate: 5 });
      // TODO: add to score depending on peg type
      if (!pegSprite.wasHit) {
        pegSprite.wasHit = true;
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
      this.ball.sprite,
      this.pegs.group,
      handleBallPegCollision
    );
  }
}
