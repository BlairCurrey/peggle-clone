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
- [x] graphics
  - [x] make pegs smaller (but make sure its visible)
  - [x] fix peg hitbox to match sprite
- [x] fix ball hitbox to match sprite (currently square)
- [x] make Ball extend sprite as show in comments or keep-as-is and remove comments
- abandoned. if i extend the sprite I can add to physic by doing: `this.scene.physics.add.existing(this);`
- [x] rework sprite/audio config to use enums for the "keys" (asset names) and map those enums to the paths `enum ImageName`, `const imagePathByName = {...}`

## alpha features

- [x] ball with aimer can be shot in direction of aimer
- [x] aimer boundaries (no aiming up for example)
- [x] aimer controlled with keyboard
- [x] ball shoots out on cannon fire
- [x] ball is subject to gravity
- [x] some arbitrary number of pegs/blocks on screen (some trivial level)
- [x] ball bounces off pegs/blocks
- [x] better physics: ball should lose momentum on peg hit
- [ ] fix bug where barely hitting edge of peg richochets ball in wrong direction (still happens, hard to reproduce)
- [x] ball bounces off walls
- [x] objects disappear when hit by ball
- [x] add delay to objects disappearing when hit by ball
- [x] ball is destroyed when it hits bottom of screen
- [x] when ball is "gone" a new ball loads up top (and cannot shoot before this point)
- [x] Track gamestate and display on HUD (score, ball count)
  - `GameStateManager`. singleton, interface for getting/setting state, emits events on set (maybe)
- [ ] win when 0 pegs left, else lose when 0 balls left
- [x] "Preloader" scene to preload all assets, then "Game" scene https://youtu.be/z15L4E7A3wY?si=HRf457MpaxG0EbKl&t=318
- [ ] ball should not reset until pegs are done disappearing
- [x] can gain points by hitting a block
- [x] audio
  - [x] on shoot
  - [x] on block hit
- [x] background music
- [ ] different peg types
  - maybe pass peg into a constructor for new `Peg` class? with type, sprite, point value, etc. referring to peg from `const peg = this.group.create` in `class Pegs`
  - [ ] have different sprites
  - [ ] have different point values
  - [ ] win when all of a certain type of peg is gone - loops through each in the game update? or maybe track if target type is 0?

## beta featrures

- [ ] aimer can also be controlled with mouse and fired with click
- [ ] free ball bucket - moving "bucket" that should end turn but not decrease ball possession
- [ ] aimer is affected by gravity/matches trajectory of ball

## open questions

- [ ] should i use geometry instead of sprites? for pegs. can probably handle polygon collision better (sprites are just circle/square?)
- [ ] game style. clean, minimalistic, space-ish? black background, cyan pegs (high contrast). or maybe more muted?

# Theme inspo

Alien movie - dark, space, grim, bleak.

- palette: https://coolors.co/1d1e1e-1b2f37-68bae8-1e1a1b-1a3342
- from: https://filmfreedonia.files.wordpress.com/2015/04/alien06.jpg?w=1024
  planets for pegs? maybe not these (not dark/grim) but just as an idea: https://www.shutterstock.com/image-vector/alien-space-planets-cartoon-fantastic-260nw-2195689619.jpg
