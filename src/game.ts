import * as Phaser from "phaser";
import { Ball } from "./Ball";
import { Pegs } from "./Pegs";
import { spriteConfig } from "./spriteConfig";

class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image(spriteConfig.ball.key, spriteConfig.ball.path);
    this.load.image(spriteConfig.peg2.key, spriteConfig.peg2.path);
  }

  create() {
    this.scene.start("game");
  }
}

class Game extends Phaser.Scene {
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

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  width: 800,
  height: 600,
  scene: [Preloader, Game],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      // alternatively, set in scene create with this.physics.world.setBounds
      checkCollision: {
        up: true,
        down: false,
        left: true,
        right: true,
      },
    },
  },
};

const game = new Phaser.Game(config);
