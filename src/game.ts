import * as Phaser from "phaser";
import * as Scene from "./scenes";
import { Color } from "./utils/Color";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: Color.BLUE_900,
  width: 512,
  height: 640,
  scene: [Scene.Preloader, Scene.Game],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      // alternatively, set in scene create with this.physics.world.setBounds
      checkCollision: {
        up: true,
        down: false,
        left: true,
        right: true,
      },
    },
  },
};

const game = new Phaser.Game(config);
