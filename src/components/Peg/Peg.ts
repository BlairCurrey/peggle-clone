import { AudioKey } from "../../config/audio";
import { GameConfig } from "../../config/game";
import { ImageKey } from "../../config/images";
import { v4 as uuidv4 } from "uuid";

export enum PegType {
  COMMON = "common",
  TARGET = "target",
  BONUS = "bonus",
}
export const pegTypes: PegType[] = Object.values(PegType);

abstract class Peg {
  abstract type: PegType;
  // abstract sound: Phaser.Sound.BaseSound;

  // these "getters" allow calling `this.imageKey` (and simmilar) in this abstract class's
  // constructor and getting the subclasses's this.image. This is in contrast to `abstract image: Image`
  // which would always be `undefined` in this abstract class.
  abstract get imageKey(): ImageKey;
  abstract get basePoints(): number;

  wasHit: boolean = false;
  size: number = GameConfig.PEG_SIZE;
  audioKey: AudioKey = AudioKey.BLASTER3;

  id: string;
  phaserImage: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    // abstract this.imageKey will be defined in subclasses
    this.phaserImage = scene.physics.add.image(x, y, this!.imageKey);
    group.add(this.phaserImage);

    // Make hitbox match sprite
    this.phaserImage
      .setDisplaySize(this.size, this.size)
      .setCircle(this.phaserImage.width / 2);
    this.phaserImage
      .setImmovable(true)
      .setData("wasHit", this.wasHit)
      .setData("basePoints", this!.basePoints) // abstract this.basePoints will be defined by subclasses
      .setData("sound", scene.sound.add(this.audioKey))
      .setData("pegType", this!.type); // this.type will be defined by subclasses

    this.id = uuidv4();
  }

  // TODO:
  // playSound() {
  //   this.sound!.play({ rate: 5 });
  // }
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
  get type() {
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
  get type() {
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
  get type() {
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
