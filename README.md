# Peggle Clone

bootstrapped with [phaser3-typescript-project-template](https://github.com/photonstorm/phaser3-typescript-project-template)

Can test build by running `dist/index.html` on a local server (such as VScode live server)

# TODO

## tech debt

- [x] dist should not be version controlled, but project not setup to actually build correctly.
  - asset should be outside dist and copied in
  - index.html should be outside dist and copied in
  - not sure about game.js.map and game.js (why does it look different than dev/watch output?)
- [ ] ball sprite/logic should be seperated from scene (make own class?)
- [ ] new scene dir with Preloader and Game. needs to be supported in rollup (currently only supports output of src/game.ts specifically)
- [ ] make pegs smaller (but make sure its visible)
- [ ] fix peg hitbox to match sprite

## alpha features

- [x] ball with aimer can be shot in direction of aimer
- [x] aimer boundaries (no aiming up for example)
- [x] aimer controlled with keyboard
- [x] ball shoots out on cannon fire
- [x] ball is subject to gravity
- [x] some arbitrary number of pegs/blocks on screen (some trivial level)
- [x] ball bounces off pegs/blocks
- [ ] better physics: ball should lose momentum on peg hit
- [x] ball bounces off walls
- [x] objects disappear when hit by ball
- [x] add delay to objects disappearing when hit by ball
- [ ] ball is "gone" when it hits bottom of screen
- [ ] when ball is "gone" a new ball loads up top (and cannot shoot before this point)
- [ ] there is some ball limit (3, 5?) and game over when limit is 0 and turn is over
- [x] "Preloader" scene to preload all assets, then "Game" scene https://youtu.be/z15L4E7A3wY?si=HRf457MpaxG0EbKl&t=318
- [ ] free ball bucket - moving "bucket" that should end turn but not decrease ball possession

## beta featrures

- [ ] aimer can also be controlled with mouse and fired with click
- [ ] can gain points by hitting a block (1 point per block)
- [ ] audio
  - [ ] on shoot
  - [ ] on block hit
- [ ] HUD: score, ball count
