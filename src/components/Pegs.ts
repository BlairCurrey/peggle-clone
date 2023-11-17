import * as Phaser from "phaser";
import { orbImages } from "../config/images";

export interface PegConfig {
  x: number;
  y: number;
}
type PegsConfig = PegConfig[];

export class Pegs {
  scene!: Phaser.Scene;
  group!: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, pegsConfig: PegsConfig) {
    this.scene = scene;
    this.group = this.scene.physics.add.group();

    pegsConfig.forEach((pegConfig: PegConfig) => {
      const orb = orbImages[Phaser.Math.Between(0, orbImages.length - 1)];
      const peg = this.scene.physics.add.image(pegConfig.x, pegConfig.y, orb);
      this.group.add(peg);

      // Make hitbox match sprite
      const pegSize = 20;
      peg.setDisplaySize(pegSize, pegSize).setCircle(peg.width / 2);
      peg.setImmovable(true).setData("wasHit", false);
    });
  }
}
