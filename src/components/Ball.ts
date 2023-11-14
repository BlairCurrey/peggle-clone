import * as Phaser from "phaser";
import { spriteConfig } from "../utils/images";
import { audioConfig } from "../utils/audio";

// TODO: refactor to truly extend Phaser.Physics.Arcade.Sprite instead of having Ball.sprite?
// Would have to figure out what to do instead of this.sprite = this.scene.physics.add.sprite( ... )
// Otherwise, probably shouldnt extend sprite (many constructor args not used for example)
// To truly extend sprite, maybe extend from Sprite and do:
//  this.x = this.startPoint.x;
//  this.y = this.startPoint.y;
//  this.texture = ???
//  this.scene.physics.add.existing(this);
export class Ball {
  private width: number = 15;
  private aimingAngle = 0;
  private aimAdjustIncrement = 0.1;
  private isActive = false;

  private scene: Phaser.Scene;
  private startPoint!: Phaser.Geom.Point;
  private aimingLine!: Phaser.GameObjects.Graphics;
  private shotSound!: Phaser.Sound.BaseSound;
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.shotSound = this.scene.sound.add(audioConfig.blaster2.key);
    const centerX = this.scene.cameras.main.width / 2;
    this.startPoint = new Phaser.Geom.Point(
      centerX - this.width / 2,
      this.width + 1
    );

    this.init();
  }

  private init() {
    // TODO: if extending Sprite, do:
    // this.x = this.startPoint.x;
    // this.y = this.startPoint.y;
    // this.texture = ???
    // this.scene.physics.add.existing(this);
    this.sprite = this.scene.physics.add.sprite(
      this.startPoint.x,
      this.startPoint.y,
      spriteConfig.ball.key
    );
    this.sprite.setScale(
      this.width / this.sprite.width,
      this.width / this.sprite.height
    );
    this.sprite.body.setCircle(this.width * 2);
    this.sprite.setBounce(0.85).setCollideWorldBounds(true);
    // TODO: best way to do this?
    // this.sprite.setDamping(true);
    // this.sprite.setDrag(0.99);

    // Aim line
    this.aimingLine = this.scene.add.graphics();
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
    this.aimingLine.lineStyle(2, 0xff0000);
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
