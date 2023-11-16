import { Scene } from "phaser";

export function loadImages(scene: Scene) {
  Object.entries(imagePaths).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}

export enum Image {
  BALL = "ball",
  ORB = "orb",
}

const imagePaths: { [key in Image]: string } = {
  [Image.BALL]: "assets/images/ball.png",
  [Image.ORB]: "assets/images/blue-orb.png",
};
