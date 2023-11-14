# Peggle Clone

bootstrapped with [phaser3-typescript-project-template](https://github.com/photonstorm/phaser3-typescript-project-template)

Can test build by running `dist/index.html` on a local server (such as VScode live server)

# TODO

## tech debt

- [x] dist should not be version controlled, but project not setup to actually build correctly.
  - asset should be outside dist and copied in
  - index.html should be outside dist and copied in
  - not sure about game.js.map and game.js (why does it look different than dev/watch output?)
- [x] ball sprite/logic should be seperated from scene (make own class?)
- [x] peg sprite/logic should be seperated from scene
- [x] new scene dir with Preloader and Game. maybe need to be supported in rollup (may currently only supports output of src/game.ts specifically)
- [ ] make pegs smaller (but make sure its visible)
- [ ] fix peg hitbox to match sprite
- [x] fix ball hitbox to match sprite (currently square)
- [ ] make Ball extend sprite as show in comments or keep-as-is and remove comments

## alpha features

- [x] ball with aimer can be shot in direction of aimer
- [x] aimer boundaries (no aiming up for example)
- [x] aimer controlled with keyboard
- [x] ball shoots out on cannon fire
- [x] ball is subject to gravity
- [x] some arbitrary number of pegs/blocks on screen (some trivial level)
- [x] ball bounces off pegs/blocks
- [x] better physics: ball should lose momentum on peg hit
- [ ] fix bug where barely hitting edge of peg richochets ball in wrong direction
- [x] ball bounces off walls
- [x] objects disappear when hit by ball
- [x] add delay to objects disappearing when hit by ball
- [x] ball is destroyed when it hits bottom of screen
- [x] when ball is "gone" a new ball loads up top (and cannot shoot before this point)
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
  - pattern for tracking score: maybe overengineered? https://chat.openai.com/c/8a1fee8b-9164-4650-a726-3ee02c0f63c5
- [ ] ball should not reset until pegs are done disappearing

## open questions

- [ ] should i use geometry instead of sprites? for pegs. can probably handle polygon collision better (sprites are just circle/square?)
- [ ] game style. clean, minimalistic, space-ish? black background, cyan pegs (high contrast).
