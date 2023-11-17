import * as Phaser from "phaser";
import { loadAudio } from "../config/audio";
import { loadImages } from "../config/images";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    loadImages(this);
    loadAudio(this);
  }

  create() {
    this.scene.start("game");
  }
}
