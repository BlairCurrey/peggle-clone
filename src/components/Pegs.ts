import * as Phaser from "phaser";
import { PegType, createPegByType } from "./Peg/Peg";

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
    // this.pegs: Pegs[]
    // - where Pegs includes:
    //   - Pegs.id: number
    //   - Pegs.phaserImage: Phaser.Physics.Arcade.Image
    // this.PegById: {[id: number]: Peg}

    // TODO: Make it possible to get a specfic Peg (my object, not phaser image/sprite) in the collider callback:
    // this.physics.add.collider(ball.sprite, this.pegs.group, (ballSprite, pegSprite) => { ... }));

    // This seems complicated (sometimes interfacing with pegs via Pegs.group, other times using pegsBySprite, etc.).
    // Would also need to destroy them when pegs from group are destroyed.

    // Alternatives:
    // 1) just use setData() to store/reg point value then do pegSprite.getData("basePoints") in collider callback.
    //    - dont like this pattern because the values arent typed and it is harder to read and understand what is on a peg image.
    // 2) dont use groups? havent really thought this through. But not sure how well groups work when extending to different peg shapes/types anyways which might completely change the collider callback problem.
    // 3) Maintain a pegById which stores an interal id for each peg which maps to the Peg instance.
    //    In Peg constuctor, do phaserImage.setData('pegId', pegId). Add Pegs.getPegBySprite(pegSprite) { return pegById[pegSprite.getData('pegId')] }
    //    This would allow me to do pegById[pegSprite.id].basePoints in the collider callback. Would maybe need to destroy them when pegs from group are destroyed?

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
}
