import * as Phaser from "phaser";
import { AudioKey } from "../config/audio";
import { GameConfig } from "../config/game";
import { ImageKey } from "../config/images";

export enum PegType {
  COMMON = "common",
  TARGET = "target",
  BONUS = "bonus",
}
export const pegTypes: PegType[] = Object.values(PegType);

export type AnyPeg = CommonPeg | TargetPeg | BonusPeg;

abstract class Peg extends Phaser.Physics.Arcade.Image {
  abstract pegType: PegType;
  // these "getters" allow calling `this.imageKey` (and simmilar) in this abstract class's
  // constructor and getting the subclasses's this.image. This is in contrast to `abstract image: Image`
  // which would always be `undefined` in this abstract class.
  abstract get imageKey(): ImageKey;
  abstract get basePoints(): number;

  sound: Phaser.Sound.BaseSound;

  wasHit: boolean = false;
  size: number = GameConfig.PEG_SIZE;
  audioKey: AudioKey = AudioKey.BLASTER3;

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(scene, x, y, "");
    // abstract this.imageKey will be defined in subclasses
    this.setTexture(this!.imageKey);
    this.scene.add.existing(this);
    group.add(this);

    // Make hitbox match sprite
    this.setDisplaySize(this.size, this.size).setCircle(this.width / 2);
    this.setImmovable(true);

    this.sound = scene.sound.add(this.audioKey);
  }

  playSound() {
    this.sound.play({ rate: 5 });
  }
}

export function createPegByType(
  type: PegType,
  x: number,
  y: number,
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.Group
) {
  switch (type) {
    case PegType.COMMON:
      return new CommonPeg(x, y, scene, group);
    case PegType.TARGET:
      return new TargetPeg(x, y, scene, group);
    case PegType.BONUS:
      return new BonusPeg(x, y, scene, group);
    default:
      throw new Error(`Unknown peg type: ${type}`);
  }
}

class CommonPeg extends Peg {
  get pegType() {
    return PegType.COMMON;
  }
  get basePoints() {
    return 10;
  }
  get imageKey() {
    return ImageKey.ORB_BLUE;
  }

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(x, y, scene, group);
  }
}

class TargetPeg extends Peg {
  get pegType() {
    return PegType.TARGET;
  }
  get basePoints() {
    return 100;
  }
  get imageKey() {
    return ImageKey.ORB_GREEN_1;
  }

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(x, y, scene, group);
  }
}

class BonusPeg extends Peg {
  get pegType() {
    return PegType.BONUS;
  }
  get basePoints() {
    return 1000;
  }
  get imageKey() {
    return ImageKey.ORB_PINK;
  }

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(x, y, scene, group);
  }
}
