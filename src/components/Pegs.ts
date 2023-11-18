import * as Phaser from "phaser";
import { AnyPeg, PegType, createPegByType } from "./Peg";

export interface PegConfig {
  x: number;
  y: number;
  type: PegType;
}
type PegsConfig = PegConfig[];

export class Pegs {
  scene!: Phaser.Scene;
  group!: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, pegsConfig: PegsConfig) {
    this.scene = scene;
    this.group = this.scene.physics.add.group();

    pegsConfig.forEach((pegConfig: PegConfig) => {
      createPegByType(
        pegConfig.type,
        pegConfig.x,
        pegConfig.y,
        this.scene,
        this.group
      );
    });
  }

  getTargetPegCount() {
    // TODO: optimize this by storing the count and updating it when pegs are destroyed
    return this.group
      .getChildren()
      .filter((child: AnyPeg) => child.pegType === PegType.TARGET).length;
  }
}
