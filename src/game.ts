import * as Phaser from "phaser";
import { Ball } from "./Ball";
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
    const makePeg = (
      pegs: Phaser.Physics.Arcade.Group,
      x: number,
      y: number,
      texture: string
    ) => {
      const peg = pegs.create(x, y, texture);
      // const peg = this.physics.add.sprite(x, y, texture);
      const pegWidth = 20;
      peg.setScale(pegWidth / peg.width, pegWidth / peg.height);
      peg.body.setCircle(pegWidth);
      peg.setImmovable(true);
      return peg;
    };
    // Make pegs
    const pegs = this.physics.add.group();

    makePeg(pegs, 300, 300, "peg2");
    makePeg(pegs, 215, 350, "peg2");

    const ball = new Ball(this);

    const handleBallPegCollision = (ball, peg) => {
      // Add a 2-second delay before destroying the peg using setTimeout
      setTimeout(() => {
        // Create a fade-out animation for the peg
        this.tweens.add({
          targets: peg,
          alpha: 0, // Make the peg fully transparent
          duration: 1000, // Duration of the animation in milliseconds
          onComplete: () => {
            // Once the animation is complete, destroy the peg
            peg.destroy();
          },
        });
      }, 2000);
    };
    this.physics.add.collider(ball.sprite, pegs, handleBallPegCollision);
  }

  update() {
    // Phaser.Physics.Arcade.collide("ball", "peg2", (ball, peg) => {
    //   peg.destroy();
    // }
    // collide
  }
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
