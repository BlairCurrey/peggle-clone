import * as Phaser from "phaser";
import { PegConfig } from "../components/Pegs";
import { GameConfig } from "../config/game";

export function generateRandomPegs(
  scene: Phaser.Scene,
  count: number
): PegConfig[] {
  const pegs: PegConfig[] = [];

  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.Between(
      0 + 100,
      scene.game.scale.width - GameConfig.BORDER_OFFSET_X
    );
    const y = Phaser.Math.Between(0 + 200, scene.game.scale.height - 20);
    pegs.push({ x, y });
  }

  return pegs;
}
