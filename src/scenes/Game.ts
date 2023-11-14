import * as Phaser from "phaser";
import { Ball } from "../components/Ball";
import { Pegs } from "../components/Pegs";
import { spriteConfig } from "../spriteConfig";

export class Game extends Phaser.Scene {
  private ball!: Ball;
  private pegs!: Pegs;

  constructor() {
    super("game");
  }

  create() {
    this.pegs = new Pegs(this, [
      { x: 300, y: 300, texture: spriteConfig.peg2.key },
      { x: 340, y: 350, texture: spriteConfig.peg2.key },
      { x: 440, y: 460, texture: spriteConfig.peg2.key },
    ]);
    this.ball = new Ball(this);
    this.addBallPegCollision();
  }

  private addBallPegCollision() {
    const handleBallPegCollision = (ballSprite, pegSprite) => {
      // TODO: add to score depending on peg type
      // Add a 2-second delay before destroying the peg
      setTimeout(() => {
        this.tweens.add({
          targets: pegSprite,
          alpha: 0, // make peg transparent
          duration: 1000, // 1 second
          onComplete: () => pegSprite.destroy()
        });
      }, 2000);
    };

    this.physics.add.collider(
      this.ball.sprite,
      this.pegs.group,
      handleBallPegCollision
    );
  }

  update() {
    if (this.ball.isOffScreen) {
      this.ball.destroy();
      this.ball = new Ball(this);
      this.addBallPegCollision();
    }
  }
}
