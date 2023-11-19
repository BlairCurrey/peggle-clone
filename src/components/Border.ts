import * as Phaser from "phaser";
import { GameConfig } from "../config/game";
import { ImageKey } from "../config/images";

export class Border {
  private leftImage!: Phaser.GameObjects.Image;
  private rightImage!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.leftImage = scene.add.image(
      GameConfig.BORDER_OFFSET_X / 2,
      scene.cameras.main.centerY,
      ImageKey.BORDER_LEFT
    );
    this.leftImage.setDepth(-1);
    this.rightImage = scene.add.image(
      scene.cameras.main.width - GameConfig.BORDER_OFFSET_X / 2,
      scene.cameras.main.centerY,
      ImageKey.BORDER_RIGHT
    );
    this.rightImage.setDepth(-1);

    // Set display size for the sprites
    const borderHeight = scene.cameras.main.height;
    this.leftImage.setDisplaySize(GameConfig.BORDER_OFFSET_X, borderHeight);
    this.rightImage.setDisplaySize(GameConfig.BORDER_OFFSET_X, borderHeight);

    // alternatively, could setup physics on border sprites but this proved simpler
    scene.physics.world.setBounds(
      GameConfig.BORDER_OFFSET_X,
      0,
      scene.cameras.main.width - GameConfig.BORDER_OFFSET_X * 2,
      scene.cameras.main.height
    );
  }
}
