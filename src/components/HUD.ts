import { Event } from "../utils/EventEmitter";
import { GameStateManager } from "../utils/GameStateManager";

export class HUD {
  scene!: Phaser.Scene;
  gameStateManager!: GameStateManager;
  ballCountText!: Phaser.GameObjects.Text;
  scoreText!: Phaser.GameObjects.Text;

  constructor(scene) {
    this.scene = scene;
    this.gameStateManager = new GameStateManager(); // gets existing via singleton
    this.ballCountText = this.createText(
      16,
      16,
      `Balls left: ${this.gameStateManager.getState().ballCount}`
    );
    this.scoreText = this.createText(
      16,
      32,
      `Score: ${this.gameStateManager.getState().score}`
    );

    // Subscribe to events
    this.gameStateManager.subscribe(
      Event.BALL_COUNT_CHANGE,
      this.updateLives.bind(this)
    );
    this.gameStateManager.subscribe(
      Event.SCORE_CHANGE,
      this.updateScore.bind(this)
    );
  }

  createText(x, y, text) {
    return this.scene.add.text(x, y, text, {
      fontFamily: "Arial",
      fontSize: 16,
      color: "#ffffff",
    });
  }

  updateLives(newLives) {
    this.ballCountText.setText(`Lives: ${newLives}`);
  }

  updateScore(newScore) {
    this.scoreText.setText(`Score: ${newScore}`);
  }
}
