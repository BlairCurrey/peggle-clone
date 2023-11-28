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
  ORB_YELLOW = "orb_yellow",
  BORDER_LEFT = "border-left",
  BORDER_RIGHT = "border-right",
}

const pathByImageKey: { [key in ImageKey]: string } = {
  [ImageKey.BALL]: "assets/images/ball.png",
  [ImageKey.ORB_BLUE]: "assets/images/orb-blue.png",
  [ImageKey.ORB_PINK]: "assets/images/orb-pink.png",
  [ImageKey.ORB_GREEN_1]: "assets/images/orb-green1.png",
  [ImageKey.ORB_GREEN_2]: "assets/images/orb-green2.png",
  [ImageKey.ORB_YELLOW]: "assets/images/orb-yellow.png",
  [ImageKey.BORDER_LEFT]: "assets/images/border-left2.png",
  [ImageKey.BORDER_RIGHT]: "assets/images/border-right2.png",
};
