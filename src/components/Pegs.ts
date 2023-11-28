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
  // TODO: add id to peg and collect that instead of the entire object
  private pegsToDestroy: AnyPeg[] = [];

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
      .filter((peg: AnyPeg) => peg.pegType === PegType.TARGET).length;
  }

  queuePegForDestruction(peg: AnyPeg) {
    this.pegsToDestroy.push(peg);
  }

  destroy() {
    this.pegsToDestroy.forEach((peg: AnyPeg, i: number) => {
      // TODO: this is bugged - will destroy after win check
      // wont detect win until turn after hitting all targets
      // setTimeout(() => {
      //   peg.destroy();
      // }, i * 200); // destory pegs one by one
      peg.destroy();
    });
  }

  getPegsWithinRadius(x: number, y: number, radius: number) {
    return this.group.getChildren().filter((peg: AnyPeg) => {
      const distance = Phaser.Math.Distance.Between(x, y, peg.x, peg.y);
      return distance < radius;
    }) as AnyPeg[];
  }
}
