import * as Phaser from "phaser";
import { Ball } from "../components/Ball";
import { Pegs } from "../components/Pegs";
import { spriteConfig } from "../utils/spriteConfig";
import { GameStateManager } from "../utils/GameStateManager";
import { HUD } from "../components/HUD";

export class Game extends Phaser.Scene {
  private ball!: Ball;
  private pegs!: Pegs;
  private gameStateManager!: GameStateManager;

  constructor() {
    super("game");
  }

  create() {
    this.gameStateManager = new GameStateManager();
    new HUD(this);
    this.pegs = new Pegs(this, [
      { x: 300, y: 300, texture: spriteConfig.peg2.key },
      { x: 340, y: 350, texture: spriteConfig.peg2.key },
      { x: 440, y: 460, texture: spriteConfig.peg2.key },
    ]);
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
      console.log(ballCount);

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
      // TODO: add to score depending on peg type
      // Add a 2-second delay before destroying the peg
      if (!pegSprite.wasHit) {
        pegSprite.wasHit = true;
        this.gameStateManager.incrementScore(100);
        console.log(this.gameStateManager.getState());
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
