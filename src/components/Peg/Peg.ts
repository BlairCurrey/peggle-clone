// Abstract class example
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
  abstract basePoints: number;
  abstract type: PegType;

  // image "getter" allows us to call `this.image` in this abstract class's constructor
  // and and get the subclasses's this.image. This is in contrast to `abstract image: Image`
  // which would always be `undefined` in this abstract class.
  abstract get imageKey(): ImageKey;

  wasHit: boolean = false;
  size: number = GameConfig.PEG_SIZE;

  id: string;
  // TODO: Should this be static body?
  phaserImage: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    // this.image will be set by subclasses
    this.phaserImage = scene.physics.add.image(x, y, this!.imageKey);
    group.add(this.phaserImage);

    // Make hitbox match sprite
    this.phaserImage
      .setDisplaySize(this.size, this.size)
      .setCircle(this.phaserImage.width / 2);
    // TODO: refactor wasHit to use Peg.wasHit
    this.phaserImage.setImmovable(true).setData("wasHit", false);

    this.id = uuidv4();
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
  type = PegType.COMMON;
  basePoints = 10;

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
  type = PegType.COMMON;
  basePoints = 100;

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
  type = PegType.COMMON;
  basePoints = 1000;

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
