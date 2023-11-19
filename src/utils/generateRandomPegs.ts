import * as Phaser from "phaser";
import { PegConfig } from "../components/Pegs";
import { GameConfig } from "../config/game";
import { pegTypes } from "../components/Peg";

export function generateRandomPegs(
  scene: Phaser.Scene,
  count: number
): PegConfig[] {
  const pegs: PegConfig[] = [];

  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.Between(
      GameConfig.BORDER_OFFSET_X + GameConfig.PEG_SIZE,
      scene.game.scale.width - GameConfig.BORDER_OFFSET_X
    );
    const y = Phaser.Math.Between(
      0 + 200,
      scene.game.scale.height - GameConfig.PEG_SIZE
    );
    const pegType = pegTypes[Phaser.Math.Between(0, pegTypes.length - 1)];
    pegs.push({ x, y, type: pegType });
  }

  return pegs;
}
