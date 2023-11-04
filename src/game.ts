import * as Phaser from "phaser";

export default class Level1 extends Phaser.Scene {
  constructor() {
    super("level1");
  }

  preload() {
    this.load.image("ball", "assets/ball.png");
  }

  create() {
    this.physics.world.setBounds(
      0,
      0,
      config.width,
      config.height,
      true,
      true,
      true,
      false
    );

    // TODO: make this repeatable so we can reset ball on end of turn
    const centerX = this.cameras.main.width / 2;
    const ballWidth = 15;
    const ballStartX = centerX - ballWidth / 2;
    const ballStarty = ballWidth + 1;
    const ball = this.physics.add.sprite(ballStartX, ballStarty, "ball");
    ball.setScale(ballWidth / ball.width, ballWidth / ball.height);
    ball.setBounce(1).setCollideWorldBounds(true);

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
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  width: 800,
  height: 600,
  scene: [Level1],
  physics: {
    default: "arcade",
  },
};

const game = new Phaser.Game(config);
