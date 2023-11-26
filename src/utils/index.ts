import * as Phaser from "phaser";
import { PegType, pegTypes } from "../components/Peg";
import { PegConfig } from "../components/Pegs";
import { GameConfig } from "../config/game";

export function pegConfigToQueryParams(pegConfig: PegConfig[]) {
  const queryParams = new URLSearchParams();
  pegConfig.forEach((peg, index) => {
    Object.entries(peg).forEach(([key, value]) => {
      queryParams.append(`pegs[${index}][${key}]`, value);
    });
  });
  return queryParams;
}

export function queryParamsToPegConfig(queryParams: URLSearchParams) {
  const pegConfig: PegConfig[] = [];
  let pegCount = 0;

  // Iterate through query parameters to find the maximum index
  queryParams.forEach((value, key) => {
    const matches = key.match(/pegs\[(\d+)\]\[x\]/);
    if (matches) {
      const index = parseInt(matches[1]);
      if (index >= pegCount) {
        pegCount = index + 1;
      }
    }
  });
  for (let i = 0; i < pegCount; i++) {
    const peg: PegConfig = {
      x: Number(queryParams.get(`pegs[${i}][x]`)),
      y: Number(queryParams.get(`pegs[${i}][y]`)),
      type: queryParams.get(`pegs[${i}][type]`) as PegType,
    };
    pegConfig.push(peg);
  }
  return pegConfig;
}

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
