import * as Phaser from "phaser";
import { Ball } from "../components/Ball";
import { Pegs } from "../components/Pegs";

export class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    const pegs = new Pegs(this, [
      { x: 300, y: 300, texture: "peg2" },
      { x: 340, y: 350, texture: "peg2" },
      { x: 440, y: 460, texture: "peg2" },
    ]);
    const ball = new Ball(this);

    const handleBallPegCollision = (ball, peg) => {
      // TODO: add to score depending on peg type
      // Add a 2-second delay before destroying the peg
      setTimeout(() => {
        // Create a fade-out animation for the peg
        this.tweens.add({
          targets: peg,
          alpha: 0, // make peg transparent
          duration: 1000, // 1 second
          onComplete: () => {
            peg.destroy();
          },
        });
      }, 2000);
    };
    this.physics.add.collider(ball.sprite, pegs.group, handleBallPegCollision);
  }

  update() {}
}

export const Something = {};
