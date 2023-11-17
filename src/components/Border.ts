import * as Phaser from "phaser";
import { GameConfig } from "../config/game";

export class Border extends Phaser.GameObjects.Rectangle {
  constructor(scene: Phaser.Scene) {
    super(
      scene,
      scene.cameras.main.centerX,
      scene.cameras.main.centerY,
      scene.cameras.main.width - GameConfig.BORDER_OFFSET_X,
      scene.cameras.main.height
    );
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setStrokeStyle(5, 0x1f4a5f);
    this.setVisible(true);

    this.scene.physics.world.setBounds(
      this.x - this.displayWidth / 2 + GameConfig.BALL_WIDTH / 2,
      this.y - this.displayHeight / 2 + GameConfig.BALL_WIDTH / 2,
      this.displayWidth - GameConfig.BALL_WIDTH,
      this.displayHeight - GameConfig.BALL_WIDTH
    );
  }
}
