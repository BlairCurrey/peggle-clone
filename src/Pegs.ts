import * as Phaser from "phaser";

interface PegConfig {
  x: number;
  y: number;
  texture: string;
}
type PegsConfig = PegConfig[];

export class Pegs {
  scene!: Phaser.Scene;
  group!: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, pegsConfig: PegsConfig) {
    this.scene = scene;
    this.group = this.scene.physics.add.group();
    pegsConfig.forEach((pegConfig: PegConfig) => {
      const peg = this.group.create(
        pegConfig.x,
        pegConfig.y,
        pegConfig.texture
      );
      const pegWidth = 20;
      peg.setScale(pegWidth / peg.width, pegWidth / peg.height);
      peg.body.setCircle(pegWidth);
      peg.setImmovable(true);
    });
  }
}
