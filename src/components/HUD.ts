import { Color } from "../config/Color";
import { Event } from "../utils/EventEmitter";
import { GameStateManager } from "../utils/GameStateManager";

export class HUD {
  textColor = Color.BLUE_100;
  labelTextSize = 12;
  valueTextSize = 16;
  linePadding = 2;

  scene!: Phaser.Scene;
  gameStateManager!: GameStateManager;
  ballsLabel!: Phaser.GameObjects.Text;
  ballCountText!: Phaser.GameObjects.Text;
  scoreLabel!: Phaser.GameObjects.Text;
  scoreText!: Phaser.GameObjects.Text;

  constructor(scene) {
    this.scene = scene;
    this.gameStateManager = new GameStateManager(); // gets existing via singleton

    this.createBallText();
    this.createScoreText();

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

  createText(x: number, y: number, text: string, size: number) {
    return this.scene.add.text(x, y, text, {
      fontFamily: "Monospace",
      fontSize: size,
      color: this.textColor,
    });
  }

  updateLives(newLives) {
    this.ballCountText.setText(`${newLives}`);
  }

  updateScore(newScore) {
    this.scoreText.setText(`${newScore}`);
  }

  createBallText() {
    this.ballsLabel = this.createText(
      10,
      this.labelTextSize,
      "BALLS",
      this.labelTextSize
    );
    this.ballCountText = this.createText(
      10 + this.ballsLabel.width / 2,
      this.labelTextSize + this.valueTextSize + this.linePadding,
      `${this.gameStateManager.getState().ballCount}`,
      this.valueTextSize
    );
    this.ballCountText.setOrigin(0.5, 0);
  }

  createScoreText() {
    this.scoreLabel = this.createText(
      this.scene.cameras.main.width - 32 - this.labelTextSize,
      this.labelTextSize,
      "SCORE",
      this.labelTextSize
    );
    this.scoreText = this.createText(
      this.scene.cameras.main.width - this.scoreLabel.width / 2 - 10,
      this.labelTextSize + this.valueTextSize + this.linePadding,
      `${this.gameStateManager.getState().score}`,
      this.valueTextSize
    );
    this.scoreText.setOrigin(0.5, 0);
  }
}
