# Peggle Clone

bootstrapped with [phaser3-typescript-project-template](https://github.com/photonstorm/phaser3-typescript-project-template)

Can test npm `build` command by running `dist/index.html` on a local server (such as VScode live server)

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
- [x] in Pegs, instead of `group.create`, create sprite/image and do `group.add` (or similar) to control type of object added to group
- [ ] dependency injection? basically anywhere i am importing and then running something could have those things passed in. maybe make a super simple container (all singleton?)
- [x] move image,audio from util to config
- [ ] deploy to github pages?
- [ ] make new class for the Ball aimer?
- [ ] make the spawnBall and collision handler part of the Ball class? Peg? Pegs?

  - ball:

    - pass pegs into ball and use pegs.group to register collision handler in constructor.
      - this is an advantage because peg/ball collision is registered on each new ball. If collision handler is on pegs, we need to more manually re-register when we create a new ball.
    - collision handler will be the same for all pegs (bonus, special, target, etc). so peg will need some generic methods that get implemented on all.

      - what to do if a certain peg type has a one-off behavior? maybe just add a method to the peg class that gets called in the collision handler? so we have `Ball.addBallPegCollision` but `Peg.handleBallPegCollision`? is that meaningfully different than adding the handler in pegs?

        - maybe we get the advantage of registering on ball create, but keep behavior specific to pegs? that seems good...
        - abstract Peg class can do generic things and subclasses can do more specific things. for example

        ```ts
        // in abstract class Peg
        handleBallPegCollision(ball: Ball) {
          this.playHitSound();
          this.fadeOut();
          this.addPointsToScore();
        }

        // in abstract class SpecialPeg
        handleBallPegCollision(ball: Ball) {
          this.playHitSound();
          this.fadeOut();
          this.addPointsToScore();
          this.explodeNearbyPegs();
        }
        ```

  - pegs:
    - pass the pegs into ball

- [x] refactor away from setData/getData on Peg class and groups on Pegs class. Should make these properties of the class. Group is used to register the pegs with the collision handler but I can just as easily register each peg in the Peg constructor.
  - may be closely related to the collision refactor. should that be on the Ball? Peg? Pegs? Not sure...
  - [x] use or remove uuid package (installed in anticipcation of this but not used yet)
- [x] update packages
- [ ] remove group from peg constructor and add in Pegs? Not sure if that will cause any display issues (as i recall, order in peg constructor was important)
- [ ] use npm? not really making use of pnpm and im using npm in gh action (feels weird to use different ones. probably fine for just running build command but still feels bad)
- [ ] add id to peg and change `pegsToDestroy` to `pegIdsToDestroy`. then make map of id: peg in Pegs class. then use these in the `Pegs.destroy`
  - alternatively, could name the phaser group objects and do `this.group.children.getByName('string-name');` as shown here: https://phaser.discourse.group/t/get-a-gameobject-by-its-id/1378
  - or if I have the indexes (probably matches create order?) `this.group.getChildren([0])`: https://stackoverflow.com/questions/56082396/how-to-get-a-single-member-from-a-group-in-phaser-3
    - I think I like this less than the id. its basically an id "local" to the group. IE, different groups would also have a 0 index which means the index alone isnt enough to find the specific peg. Also, in the collision handler callback, I dont think I will have the id which makes this moot.

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
- [x] win when 0 pegs left, else lose when 0 balls left
- [x] fix bug where no win trigger if peg doesnt fade before ball is gone. currently need to reshoot another ball to win (checks for remaining pegs and succeeds)
  - or, re-examine peggle to see how it handles fade-out (none until ball is gone?)
- [x] "Preloader" scene to preload all assets, then "Game" scene https://youtu.be/z15L4E7A3wY?si=HRf457MpaxG0EbKl&t=318
- [x] can gain points by hitting a block
- [x] audio
  - [x] on shoot
  - [x] on block hit
- [x] background music
- [x] different peg types
  - maybe pass peg into a constructor for new `Peg` class? with type, sprite, point value, etc. referring to peg from `const peg = this.group.create` in `class Pegs`. Currently I'm lacking much of a concept of a "Peg". Currently im just adding something to a group.
  - [x] have different sprites
  - [x] have different point values
  - [x] move peg hit sound to peg
  - [x] know which peg type on collision and act accordingly (score, sound). use setData/getData for now but ultimately might want to ungroup/set on Peg class.
  - [x] win when all of a certain type of peg are gone - loops through each in the game update? or maybe track target type?
- [ ] aimer is affected by gravity/matches trajectory of ball. (look into Phaser's rope?)
- [ ] free ball bucket - moving "bucket" that should end turn but not decrease ball possession
- [x] simple border around screen that contains hud, ball bounces off of. currently the game area is the entire screen.
- [ ] center game in screen, make background (black?)
- [x] better ball asset
- [x] border from sprite/image
- [x] win message on win and restart button/prompt (press space). lose message on lose and same restart action.
- [ ] "real" levels.
  - [ ] on game start, place all pegs for the level (static positions, not random). from something that can be represented as json (could just be list of {x, y}). then randomly change some (5?) to target pegs. Or dont change them, but init as correct type initially. But the level should have pegs in the same position each time and not determine which position is which type until the level is generated. see https://peggle.fandom.com/wiki/Insane_Aquarium?file=Insaneaquarium.png
  - [ ] on each new turn, set a `CommonPeg` to `BonusPeg`
- [ ] "Special" pegs
  - [ ] New `SpecialPeg` class with new sprite. maybe 10 points, like CommonPeg?
  - [ ] just one type for now. "blast"? (hits pegs within a certain radius of itself) multi-ball (shoots a new ball out?)
- [x] update HUD
  - [x] pick more interesting (maybe this? https://www.dafont.com/silkscreen.font).
    - monospace for now
  - [x] simple ball counter on left (BALLS, newline, the count)
  - [x] score on right (SCORE, newline, the score)
  - [ ] add sound to peg destruction

## beta featrures

- [ ] aimer can also be controlled with mouse and fired with click
- [ ] slow time if ball is on path for peg (within some small margin of error). `this.physics.world.timeScale = 1.5;` might be hard to do. maybe take the distance and velocity of ball. if distance is closing at the same rate as velocity, slow time. I think this would mean 1: it's getting closer, and 2: it's getting closer at the rate you would expect if it were heading right for it. I guess this would only work for last peg, because last peg of certain type could have something blocking it.
- [ ] batch points in turn and "flush" to score at end. show score incrementing at end of turn in middle of scren (large) and then increment score in HUD. or another interesting animation. Maybe a vertical bar that fills up then empties at end of turn with a soudn effect and a number incrementing about the bar.
- [ ] show lives as ball

## open questions

- [ ] use assets/images/border-right1 or 2?
- [ ] should i use geometry instead of sprites? for pegs. can probably handle polygon collision better (sprites are just circle/square?). or maybe do a mix?
  - build sprite from graphics? https://phaser.discourse.group/t/building-sprites-with-graphics/4936
- [x] game style. clean, minimalistic, space-ish? black background, cyan pegs (high contrast). or maybe more muted?
  - have the basic colors. originally inspired from alien but now has more contrast than starting color palette (which was basically all black/blue). emphasis on black/blue with some green and pink for contrast. kinda desaturated.
- [x] orb vs. peg name? peg comes from peggle. orb is spherical and may not work with other shapes ( so maybe just use it to refer to round pegs?)
  - use pegs. orb is just a sperical peg and could always be renamed to circle peg, sphere peg, round peg, etc.
- [ ] if adding more stuff to side borders, how to handle with sprites? currently its 1 64px sprite with a border on the inside edge. so either everything needs to fit on the outside/middle of the spire or need to add new sprite. but if adding a new sprite, its all going to be on the edge with lots of empty space towards inside. If adding more stuff, maybe make new border sprite that is the entire width (and height? so like 128px width by 768 h?)

# Theme inspo

Alien movie - dark, space, grim, bleak.

- palette: https://coolors.co/1d1e1e-1b2f37-68bae8-1e1a1b-1a3342
- from: https://filmfreedonia.files.wordpress.com/2015/04/alien06.jpg?w=1024
  planets for pegs? maybe not these (not dark/grim) but just as an idea: https://www.shutterstock.com/image-vector/alien-space-planets-cartoon-fantastic-260nw-2195689619.jpg

# Peggle Game Mechanics

https://peggle.fandom.com/wiki/Game_Mechanics

comment on score multiplier with fewer orange pegs: https://peggle.fandom.com/wiki/Game_Mechanics?commentId=4400000000000004454

```text
I can't edit this page, so I figured I would share my discoveries here. Most players know that the fever meter goes up when the number of orange pegs decreases, but fewer people know the math behind it.

2x: 15 orange pegs remaining

3x: 10 orange pegs remaining

5x: 6 orange pegs remaining

10x: 3 orange pegs remaining

My theory is that 3, 6, 10, 15 were chosen because they are the triangular numbers (1+2+3+4+...) between 2 and 20.

1+2 = 3

1+2+3 = 6

1+2+3+4 = 10

1+2+3+4+5 = 15

Also, on the "Lots of Orange Pegs" challenges, the Fever Meter will be frozen until there are 25 orange pegs remaining.
```

# Build Sprite from graphics

may be useful for non-round pegs that I want to use a sprite for.

https://phaser.discourse.group/t/building-sprites-with-graphics/4936

```ts
class RoundedRectangleSprite extends Phaser.GameObjects.Sprite {
  scene: Phaser.Scene;
  rectangleGraphics: RoundedRectangle;
  constructor(scene, x, y, width, height) {
    super(scene, x, y, "");
    scene.add.existing(this);
    this.rectangleGraphics = new RoundedRectangle(scene, { width, height });
    this.setTexture("roundedRect");
    //this.setPosition(x, y); doesn't work!
  }
}

class RoundedRectangle extends Phaser.GameObjects.Graphics {
  scene: Phaser.Scene;
  shapeGraphic: Phaser.GameObjects.Graphics;
  strokeGraphic: Phaser.GameObjects.Graphics;
  constructor(scene, rectObj: any, radius?: number) {
    super(scene);
    this.scene.add.existing(this);
    this.lineStyle(10, 0x000000);
    this.fillStyle(0xadd8e6);
    this.shapeGraphic = this.fillRoundedRect(
      0,
      0,
      rectObj.width,
      rectObj.height,
      20
    );
    this.strokeGraphic = this.strokeRoundedRect(
      0,
      0,
      rectObj.width,
      rectObj.height,
      20
    );
    this.generateTexture("roundedRect");
    this.destroy();
  }
}
```

# Deployment to Github Pages

Uses a gh action instead of repo configuration because I didn't want to actually commit the built files and have the `index.html` in root. I could commit `/dist` and point to it using git subtrees as detail here https://gist.github.com/cobyism/4730490 but I preferred not to commit `/dist` at all, so I chose the action route.

These options and more detailed in this stack overflow post: https://stackoverflow.com/a/75662195/12893676

Gh action utilizes this action: https://github.com/marketplace/actions/deploy-to-github-pages
