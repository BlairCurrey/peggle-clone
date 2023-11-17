import { Scene } from "phaser";

export function loadImages(scene: Scene) {
  Object.entries(pathByImageKey).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}

export enum ImageKey {
  BALL = "ball",
  ORB_BLUE = "orb_blue",
  ORB_PINK = "orb_pink",
  ORB_GREEN_1 = "orb_green_1",
  ORB_GREEN_2 = "orb_green_2",
}

const pathByImageKey: { [key in ImageKey]: string } = {
  [ImageKey.BALL]: "assets/images/ball.png",
  [ImageKey.ORB_BLUE]: "assets/images/orb-blue.png",
  [ImageKey.ORB_PINK]: "assets/images/orb-pink.png",
  [ImageKey.ORB_GREEN_1]: "assets/images/orb-green1.png",
  [ImageKey.ORB_GREEN_2]: "assets/images/orb-green2.png",
};
