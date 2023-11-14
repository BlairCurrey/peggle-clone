import * as Phaser from "phaser";

export function generateRandomPegs(
  scene: Phaser.Scene,
  count: number,
  textureKey: string
): { x: number; y: number; texture: string }[] {
  const pegs = [];

  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.Between(0 + 20, scene.game.scale.width - 20);
    const y = Phaser.Math.Between(0 + 200, scene.game.scale.height - 20);
    pegs.push({ x, y, texture: textureKey });
  }

  return pegs;
}
