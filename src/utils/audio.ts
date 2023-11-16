import { Scene } from "phaser";

export function loadAudio(scene: Scene) {
  Object.entries(audioPaths).forEach(([key, path]) => {
    scene.load.audio(key, path);
  });
}

export enum Audio {
  BLASTER = "blaster",
  BLASTER2 = "blaster2",
  BLASTER3 = "blaster3",
  BLASTER4 = "blaster4",
  BLASTER5 = "blaster5",
  BACKGROUND1 = "background1",
}

const audioPaths: { [key in Audio]: string } = {
  [Audio.BLASTER]: "assets/audio/blaster.mp3",
  [Audio.BLASTER2]: "assets/audio/blaster2.mp3",
  [Audio.BLASTER3]: "assets/audio/blaster3.mp3",
  [Audio.BLASTER4]: "assets/audio/blaster4.mp3",
  [Audio.BLASTER5]: "assets/audio/blaster5.mp3",
  [Audio.BACKGROUND1]: "assets/audio/psykick-112469.mp3",
};
