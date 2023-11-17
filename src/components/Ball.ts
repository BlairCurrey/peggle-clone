import * as Phaser from "phaser";
import { ImageKey } from "../config/images";
import { AudioKey } from "../config/audio";
import { GameConfig } from "../config/game";

export class Ball {
  private width: number = GameConfig.BALL_WIDTH;
  private aimingAngle = 0;
  private aimAdjustIncrement = 0.05;
  private isActive = false;

  private scene: Phaser.Scene;
  private startPoint!: Phaser.Geom.Point;
  private aimingLine!: Phaser.GameObjects.Graphics;
  private shotSound!: Phaser.Sound.BaseSound;
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.shotSound = this.scene.sound.add(AudioKey.BLASTER2);
    const centerX = this.scene.cameras.main.width / 2;
    this.startPoint = new Phaser.Geom.Point(
      centerX - this.width / 2,
      this.width + 1
    );

    this.init();
  }

  private init() {
    this.sprite = this.scene.physics.add.sprite(
      this.startPoint.x,
      this.startPoint.y,
      ImageKey.BALL
    );
    this.sprite.setScale(
      this.width / this.sprite.width,
      this.width / this.sprite.height
    );
    this.sprite.body.setCircle(this.width * 2);
    this.sprite.setBounce(0.85).setCollideWorldBounds(true);

    // Aim line
    this.aimingLine = this.scene.add.graphics();
    this.aimingLine.setDepth(-1);
    this.aimingLine.lineStyle(2, 0xffffff); // Adjust line style as needed
    this.scene.input.keyboard.on("keydown-LEFT", () => this.adjustAim("LEFT"));
    this.scene.input.keyboard.on("keydown-RIGHT", () =>
      this.adjustAim("RIGHT")
    );
    this.scene.input.keyboard.on("keydown-SPACE", this.shoot.bind(this));

    this.updateAim(); // Initial update of aiming line
  }

  private shoot() {
    if (this.isActive) return;

    this.isActive = true;
    const speed = 500;
    const velocityX = speed * Math.cos(this.adjustedAimingAngle);
    const velocityY = speed * Math.sin(this.adjustedAimingAngle);
    this.shotSound.play();
    this.sprite.setVelocity(velocityX, velocityY);
    this.sprite.body.setGravityY(500);
    this.aimingLine.clear();
  }

  private get adjustedAimingAngle() {
    return this.aimingAngle + Math.PI / 2;
  }

  private updateAim() {
    this.aimingLine.clear();
    this.aimingLine.lineStyle(1, 0xff0000);
    this.aimingLine.beginPath();
    this.aimingLine.moveTo(this.sprite.x, this.sprite.y);
    const lineLength = 50;
    const x2 = this.sprite.x + lineLength * Math.cos(this.adjustedAimingAngle);
    const y2 = this.sprite.y + lineLength * Math.sin(this.adjustedAimingAngle);
    this.aimingLine.lineTo(x2, y2);
    this.aimingLine.strokePath();
  }

  private adjustAim(direction: "LEFT" | "RIGHT") {
    if (this.isActive) return;

    if (direction === "LEFT") {
      this.aimingAngle += this.aimAdjustIncrement;
      // dont let aimer go above parallel
      if (this.aimingAngle > 1.4) {
        this.aimingAngle = 1.4;
      }
    } else {
      // dont let aimer go above parallel
      this.aimingAngle -= this.aimAdjustIncrement;
      if (this.aimingAngle < -1.4) {
        this.aimingAngle = -1.4;
      }
    }

    this.updateAim();
  }

  public get isOffScreen(): boolean {
    return this.sprite.y > this.scene.game.scale.height;
  }

  public destroy(): void {
    // unregister keyboard events, else they will still fire after ball is destroyed
    this.scene.input.keyboard.off("keydown-LEFT", this.updateAim);
    this.scene.input.keyboard.off("keydown-RIGHT", this.updateAim);
    this.scene.input.keyboard.off("keydown-SPACE", this.shoot);

    // destroy sprite and remove from scene
    this.sprite.destroy(true);
  }
}
