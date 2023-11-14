import { Scene } from "phaser";

export const audioConfig = {
  blaster: {
    key: "blaster",
    path: "assets/audio/blaster.mp3",
  },
  blaster2: {
    key: "blaster2",
    path: "assets/audio/blaster2.mp3",
  },
  blaster3: {
    key: "blaster3",
    path: "assets/audio/blaster3.mp3",
  },
  blaster4: {
    key: "blaster4",
    path: "assets/audio/blaster4.mp3",
  },
  spaceSnare: {
    key: "space-snare",
    path: "assets/audio/space-snare.mp3",
  },
} as const;

export function loadAudio(scene: Scene) {
  Object.values(audioConfig).forEach((audio) => {
    scene.load.audio(audio.key, audio.path);
  });
}
