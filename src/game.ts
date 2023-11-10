import * as Phaser from "phaser";

class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("ball", "assets/ball.png");
    this.load.image("peg1", "assets/peg1.png");
    this.load.image("peg2", "assets/peg2.png");
    this.load.image("peg3", "assets/peg3.png");
    this.load.image("peg4", "assets/peg4.png");
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

    // const peg = pegs.create(300, 300, "peg2");
    // const pegWidth = 20;
    // peg.setScale(pegWidth / peg.width, pegWidth / peg.height);
    // peg.body.setCircle(pegWidth);
    // peg.setImmovable(true);
    // const peg2 = pegs.create(215, 350, "peg2");
    // peg2.setScale(pegWidth / peg.width, pegWidth / peg.height);
    // peg2.body.setCircle(pegWidth);
    // peg2.setImmovable(true);

    // TODO: make this repeatable so we can reset ball on end of turn
    const centerX = this.cameras.main.width / 2;
    const ballWidth = 15;
    const ballStartX = centerX - ballWidth / 2;
    const ballStarty = ballWidth + 1;
    const ball = this.physics.add.sprite(ballStartX, ballStarty, "ball");
    ball.setScale(ballWidth / ball.width, ballWidth / ball.height);
    ball.body.setCircle(ballWidth * 2);
    ball.setBounce(1).setCollideWorldBounds(true);
    // TODO: best way to do this?
    ball.setDrag(0.99);

    const handleCollision = (ball, peg) => {
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

    this.physics.add.collider(ball, pegs, handleCollision);

    // Create a line for aiming
    const aimingLine = this.add.graphics();
    aimingLine.lineStyle(2, 0xffffff); // Adjust line style as needed

    // Aiming angle
    let aimingAngle = 0; // increment this to move the aiming line
    // use adjustedAimingAngle to draw the line and set velocity
    const adjustedAimingAngle = () => aimingAngle + Math.PI / 2;

    const updateAim = () => {
      aimingLine.clear();
      aimingLine.lineStyle(2, 0xff0000);
      aimingLine.beginPath();
      aimingLine.moveTo(ball.x, ball.y);
      const lineLength = 50;
      const x2 = ball.x + lineLength * Math.cos(adjustedAimingAngle());
      const y2 = ball.y + lineLength * Math.sin(adjustedAimingAngle());
      aimingLine.lineTo(x2, y2);
      aimingLine.strokePath();
    };

    const shootBall = () => {
      const speed = 500;
      const velocityX = speed * Math.cos(adjustedAimingAngle());
      const velocityY = speed * Math.sin(adjustedAimingAngle());
      ball.setVelocity(velocityX, velocityY);
      ball.body.setGravityY(500);
      aimingLine.clear();
    };

    const aimAdjustIncrement = 0.1;

    const adjustAim = (direction: "LEFT" | "RIGHT") => {
      if (direction === "LEFT") {
        aimingAngle += aimAdjustIncrement;
        // dont let aimer go above parallel
        if (aimingAngle > 1.4) {
          aimingAngle = 1.4;
        }
      } else {
        aimingAngle -= aimAdjustIncrement;
        if (aimingAngle < -1.4) {
          aimingAngle = -1.4;
        }
      }

      updateAim();
    };

    this.input.keyboard.on("keydown-LEFT", () => adjustAim("LEFT"));
    this.input.keyboard.on("keydown-RIGHT", () => adjustAim("RIGHT"));
    this.input.keyboard.on("keydown-SPACE", shootBall);

    updateAim(); // Initial update of aiming line
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
