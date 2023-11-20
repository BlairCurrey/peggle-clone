import * as Phaser from "phaser";
import { Ball } from "../components/Ball";
import { Pegs } from "../components/Pegs";
import { GameStateManager } from "../utils/GameStateManager";
import { HUD } from "../components/HUD";
import { AudioKey } from "../config/audio";
import { generateRandomPegs } from "../utils/generateRandomPegs";
import { Border } from "../components/Border";
import { AnyPeg } from "../components/Peg";

export class Game extends Phaser.Scene {
  private ball!: Ball;
  private pegs!: Pegs;
  private gameStateManager: GameStateManager;
  private hud!: HUD;
  private backgroundMusic!: Phaser.Sound.BaseSound;
  private isGameOver = false;

  constructor() {
    super("game");
  }

  create() {
    this.isGameOver = false;
    this.gameStateManager = new GameStateManager();
    this.backgroundMusic = this.sound.add(AudioKey.BACKGROUND1);
    this.backgroundMusic.play({ loop: true });
    this.hud = new HUD(this);
    this.pegs = new Pegs(this, generateRandomPegs(this, 5));
    this.ball = this.spawnBall();
    new Border(this);
  }

  update() {
    if (this.isGameOver) return;

    if (this.ball.isOffScreen) {
      this.ball.destroy();

      if (this.pegs.getTargetPegCount() === 0) {
        this.isGameOver = true;
        this.hud.flashMessage("You won! Enter to restart.");
        // TODO: should I register all listeners in Game scene then do different things based on the state of the game? for example:
        // spacebarHandler () {
        //   if (this.gameStateManager.getState().ballCount) ball.shoot();
        //   else restartScene();
        // }
        this.input.keyboard.once("keydown-ENTER", this.restartScene.bind(this));
        return;
      }

      const { ballCount } = this.gameStateManager.getState();

      if (!ballCount) {
        this.isGameOver = true;
        this.hud.flashMessage("Game over. Enter to restart.");
        this.input.keyboard.once("keydown-ENTER", this.restartScene.bind(this));
        return;
      }

      this.ball = this.spawnBall();
    }
  }

  // TODO: make this part of the ball constructor?
  private spawnBall() {
    const ball = new Ball(this);
    this.gameStateManager.decrementBallCount();
    this.addBallPegCollision(ball);
    return ball;
  }

  private addBallPegCollision(ball: Ball) {
    const handleBallPegCollision = (ball: Ball["sprite"], peg: AnyPeg) => {
      peg.playSound();
      if (!peg.wasHit) {
        peg.wasHit = true;
        this.gameStateManager.incrementScore(peg.basePoints);
      }

      setTimeout(() => {
        this.tweens.add({
          targets: peg,
          alpha: 0, // make peg transparent
          duration: 1000, // 1 second
          onComplete: () => peg.destroy(),
        });
      }, 2000);
    };

    this.physics.add.collider(
      ball.sprite,
      this.pegs.group,
      handleBallPegCollision
    );
  }

  restartScene() {
    this.gameStateManager.reset();
    this.gameStateManager = undefined;
    this.backgroundMusic.stop();
    this.scene.restart();
  }
}
