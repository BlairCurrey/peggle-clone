import * as Phaser from "phaser";
import { AudioKey } from "../config/audio";
import { GameConfig } from "../config/game";
import { ImageKey } from "../config/images";
import { Pegs } from "./Pegs";
import { GameStateManager } from "../utils/GameStateManager";

export enum PegType {
  COMMON = "common",
  TARGET = "target",
  BONUS = "bonus",
  SPECIAL = "special",
}
export const pegTypes: PegType[] = Object.values(PegType);

export type AnyPeg = CommonPeg | TargetPeg | BonusPeg | SpecialPeg;

// TODO: Refactor abstact Peg / CommonPeg extends Peg etc.

// Option 1:
// Make new BasePeg class the extends this. All pegs would extend BasePeg.
// Make onHit an abstract method here and move implementation to BasePeg
// Fixes queuePegForDestruction ts error here.
// Also might move the imageKey getters and similar (anything that assumes something about the subclass).

// Option 2:
// Composition over inheritance. Make Peg a class that has a abstract Peg instance.
// Anything currently exposed on peg would be wrapped by CommonPeg, etc. (at least onHit, anything else?)
// Specific attributes unique to pegs (blastRadius on SpecialPeg) would live on SpecialPeg with no conflict to underlying Peg.
// Could be combined with changing abstract Peg to a non-abstract BasePeg if that also makes sense.
abstract class Peg extends Phaser.Physics.Arcade.Image {
  abstract pegType: PegType;
  // these "getters" allow calling `this.imageKey` (and simmilar) in this abstract class's
  // constructor and getting the subclasses's this.image. This is in contrast to `abstract image: Image`
  // which would always be `undefined` in this abstract class.
  abstract get imageKey(): ImageKey;
  abstract get basePoints(): number;

  gameStateManager!: GameStateManager;

  wasHit: boolean = false;
  size: number = GameConfig.PEG_SIZE;

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

    this.gameStateManager = new GameStateManager(); // gets existing via singleton
  }

  onHit(pegs: Pegs) {
    if (!this.wasHit) {
      this.wasHit = true;
      this.setAlpha(0.3);
      this.gameStateManager.incrementScore(this.basePoints);
      // "this" will be AnyPeg (CommonPeg, TargetPeg, etc.) when called on sublass
      pegs.queuePegForDestruction(this as unknown as AnyPeg);
    }
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
    case PegType.SPECIAL:
      return new SpecialPeg(x, y, scene, group);
    default:
      const exhaustiveCheck: never = type; // ensures ts error if cases dont exhaust PegType
      throw new Error(`Unknown peg type: ${type}`);
  }
}

export class CommonPeg extends Peg {
  get pegType() {
    return PegType.COMMON;
  }
  get basePoints() {
    return 10;
  }
  get imageKey() {
    return ImageKey.ORB_BLUE;
  }

  audioKey: AudioKey = AudioKey.BLASTER3;

  sound: Phaser.Sound.BaseSound;

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(x, y, scene, group);
    this.sound = scene.sound.add(this.audioKey);
  }

  onHit(pegs: Pegs, opts: { silent: boolean } = { silent: false }) {
    if (!opts.silent) {
      this.sound.play({ rate: 5 });
    }
    super.onHit(pegs);
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
    return ImageKey.ORB_GREEN_2;
  }

  audioKey: AudioKey = AudioKey.BLASTER3;

  sound: Phaser.Sound.BaseSound;

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(x, y, scene, group);
    this.sound = scene.sound.add(this.audioKey);
  }

  onHit(pegs: Pegs, opts: { silent: boolean } = { silent: false }) {
    if (!opts.silent) {
      this.sound.play({ rate: 5 });
    }
    super.onHit(pegs);
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

  audioKey: AudioKey = AudioKey.BLASTER3;

  sound: Phaser.Sound.BaseSound;

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(x, y, scene, group);
    this.sound = scene.sound.add(this.audioKey);
  }

  onHit(pegs: Pegs, opts: { silent: boolean } = { silent: false }) {
    if (!opts.silent) {
      this.sound.play({ rate: 5 });
    }
    super.onHit(pegs);
  }
}

// Hardcode as AOE explosion, but may want to split this into
// different types when adding additional special pegs
export class SpecialPeg extends Peg {
  blastRadius: number = 175;

  get pegType() {
    return PegType.SPECIAL;
  }
  get basePoints() {
    return 10;
  }
  get imageKey() {
    return ImageKey.ORB_YELLOW;
  }

  sound: Phaser.Sound.BaseSound;

  audioKey: AudioKey = AudioKey.EXPLOSION12A;

  constructor(
    x: number,
    y: number,
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(x, y, scene, group);
    this.sound = scene.sound.add(this.audioKey);
  }

  onHit(pegs: Pegs) {
    if (!this.wasHit) {
      this.sound.play();
    }
    super.onHit(pegs);

    // trigger onHit for each peg within blast radius
    pegs
      .getPegsWithinRadius(this.x, this.y, this.blastRadius)
      .forEach((peg) => {
        if (peg === this || peg.wasHit) return;
        peg.onHit(pegs, { silent: true });
      });
  }
}
