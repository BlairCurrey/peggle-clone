import { Scene } from "phaser";

export function loadImages(scene: Scene) {
  Object.entries(imagePaths).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}

export enum Image {
  BALL = "ball",
  ORB_BLUE = "orb_blue",
  ORB_PINK = "orb_pink",
  ORB_GREEN_1 = "orb_green_1",
  ORB_GREEN_2 = "orb_green_2",
}

export const orbImages = [
  Image.ORB_BLUE,
  Image.ORB_PINK,
  Image.ORB_GREEN_1,
  Image.ORB_GREEN_2,
];

const imagePaths: { [key in Image]: string } = {
  [Image.BALL]: "assets/images/ball.png",
  [Image.ORB_BLUE]: "assets/images/orb-blue.png",
  [Image.ORB_PINK]: "assets/images/orb-pink.png",
  [Image.ORB_GREEN_1]: "assets/images/orb-green1.png",
  [Image.ORB_GREEN_2]: "assets/images/orb-green2.png",
};
