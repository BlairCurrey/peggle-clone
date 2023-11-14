import { Scene } from "phaser";

export const spriteConfig = {
  ball: {
    key: "ball",
    path: "assets/ball.png",
  },
  peg2: {
    key: "peg2",
    path: "assets/peg2.png",
  },
} as const;

export function loadImages(scene: Scene) {
  Object.values(spriteConfig).forEach((image) => {
    scene.load.image(image.key, image.path);
  });
}
