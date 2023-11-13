import * as Phaser from "phaser";
import { spriteConfig } from "../spriteConfig";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image(spriteConfig.ball.key, spriteConfig.ball.path);
    this.load.image(spriteConfig.peg2.key, spriteConfig.peg2.path);
  }

  create() {
    this.scene.start("game");
  }
}
