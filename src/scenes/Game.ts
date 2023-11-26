import * as Phaser from "phaser";
import { Ball } from "../components/Ball";
import { PegConfig, Pegs } from "../components/Pegs";
import { GameStateManager } from "../utils/GameStateManager";
import { HUD } from "../components/HUD";
import { AudioKey } from "../config/audio";
import { generateRandomPegs, queryParamsToPegConfig } from "../utils";
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
    this.isGameOver = false; // must be reset here because scene is reused
    this.gameStateManager = new GameStateManager();
    this.backgroundMusic = this.sound.add(AudioKey.BACKGROUND1);
    this.backgroundMusic.play({ loop: true });
    this.hud = new HUD(this);
    this.pegs = new Pegs(this, this.getPegConfig());
    this.ball = this.spawnBall();
    new Border(this);
  }

  update() {
    if (this.isGameOver) return;

    if (this.ball.isOffScreen) {
      this.endTurn();

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

  private endTurn() {
    this.ball.destroy();
    this.pegs.destroy();
  }

  private addBallPegCollision(ball: Ball) {
    const handleBallPegCollision = (ball: Ball["sprite"], peg: AnyPeg) => {
      peg.playSound();
      if (!peg.wasHit) {
        peg.wasHit = true;
        this.gameStateManager.incrementScore(peg.basePoints);
      }

      peg.setAlpha(0.3);
      this.pegs.queuePegForDestruction(peg);
    };

    this.physics.add.collider(
      ball.sprite,
      this.pegs.group,
      handleBallPegCollision
    );
  }

  private getPegConfig() {
    // loads from query params, else generates random pegs.
    // Example query params:
    // localhost:10001/?pegs[0][x]=305&pegs[0][y]=300&pegs[0][type]=common&pegs[1][x]=200&pegs[1][y]=150&pegs[1][type]=target
    // parses to:
    // [
    //   { x: 305, y: 300, type: PegType.COMMON },
    //   { x: 200, y: 150, type: PegType.TARGET },
    // ];
    let pegConfig: PegConfig[] = [];

    try {
      pegConfig = queryParamsToPegConfig(
        new URLSearchParams(window.location.search)
      );
      if (pegConfig.length === 0) {
        throw new Error("No pegs found in query params");
      }
    } catch (error) {
      console.warn(
        "Failed to parse peg config from query params. Falling back to random pegs."
      );
      pegConfig = generateRandomPegs(this, 5);
    }

    return pegConfig;
  }

  private restartScene() {
    this.gameStateManager.reset();
    this.gameStateManager = undefined;
    this.backgroundMusic.stop();
    this.scene.restart();
  }
}
