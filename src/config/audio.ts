import { Scene } from "phaser";

export function loadAudio(scene: Scene) {
  Object.entries(pathByAudioKey).forEach(([key, path]) => {
    scene.load.audio(key, path);
  });
}

export enum AudioKey {
  BLASTER = "blaster",
  BLASTER2 = "blaster2",
  BLASTER3 = "blaster3",
  BLASTER4 = "blaster4",
  BLASTER5 = "blaster5",
  BACKGROUND1 = "background1",
  EXPLOSION12A = "explosion",
}

const pathByAudioKey: { [key in AudioKey]: string } = {
  [AudioKey.BLASTER]: "assets/audio/blaster.mp3",
  [AudioKey.BLASTER2]: "assets/audio/blaster2.mp3",
  [AudioKey.BLASTER3]: "assets/audio/blaster3.mp3",
  [AudioKey.BLASTER4]: "assets/audio/blaster4.mp3",
  [AudioKey.BLASTER5]: "assets/audio/blaster5.mp3",
  [AudioKey.BACKGROUND1]: "assets/audio/psykick-112469.mp3",
  [AudioKey.EXPLOSION12A]: "assets/audio/explosion.wav",
};
