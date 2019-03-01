import { Component, Element } from "@stencil/core";
import Phaser from "phaser";

import Food from "../../objects/food";
import Snake from "../../objects/snake";

@Component({
  tag: "app-home",
  styleUrl: "app-home.css"
})
export class AppHome {
  game: Phaser.Game;
  food: Food;
  snake: Snake;
  cursors: any;
  config: any;

  @Element() homeEl: HTMLElement;

  update(time) {
    if (!this.snake.alive) {
      return;
    }

    /**
     * Check which key is pressed, and then change the direction the snake
     * is heading based on that. The checks ensure you don't double-back
     * on yourself, for example if you're moving to the right and you press
     * the LEFT cursor, it ignores it, because the only valid directions you
     * can move in at that time is up and down.
     */
    if (this.cursors.left.isDown) {
      this.snake.faceLeft();
    } else if (this.cursors.right.isDown) {
      this.snake.faceRight();
    } else if (this.cursors.up.isDown) {
      this.snake.faceUp();
    } else if (this.cursors.down.isDown) {
      this.snake.faceDown();
    }

    if (this.snake.update(time)) {
      //  If the snake updated, we need to check for collision against food

      if (this.snake.collideWithFood(this.food)) {
        this.repositionFood();
      }
    }
  }

  /**
     * We can place the food anywhere in our 40x30 grid
     * *except* on-top of the snake, so we need
     * to filter those out of the possible food locations.
     * If there aren't any locations left, they've won!
     *
     * @method repositionFood
     * @return {boolean} true if the food was placed, otherwise false
     */
  repositionFood() {
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < 30; y++) {
      testGrid[y] = [];

      for (var x = 0; x < 40; x++) {
        testGrid[y][x] = true;
      }
    }

    this.snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++) {
      for (var x = 0; x < 40; x++) {
        if (testGrid[y][x] === true) {
          //  Is this position valid for food? If so, add it here ...
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0) {
      //  Use the RNG to pick a random food position
      var pos = Phaser.Math.RND.pick(validLocations);

      //  And place it
      this.food.setPosition(pos.x * 16, pos.y * 16);

      return true;
    } else {
      return false;
    }
  }

  componentDidLoad() {
    this.config = {
      type: Phaser.WEBGL,
      width: 640,
      height: 480,
      backgroundColor: "#bfcc00",
      parent: this.homeEl.querySelector('canvas'),
      scene: {
        preload: function() {
          this.load.image("food", "assets/games/snake/food.png");
          this.load.image("body", "assets/games/snake/body.png");
        },
        create: function() {
          /**
           * - YOU WERE STUCK - 
           * Scenes methods are scoped so use of
           * "this" is not able to be used
           * 
           * Try implementation found here
           * https://github.com/rblopes/phaser-3-snake-game/blob/master/app/scripts/config.js
           */
          this.food = new Food(this, 3, 4);
          this.snake = new Snake(this, 8, 8);

          //  Create our keyboard controls
          this.cursors = this.input.keyboard.createCursorKeys();
        },
        update: this.update
      }
    };

    this.game = new Phaser.Game(this.config);
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="dark">
          <ion-title>Madness Snake</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <canvas width="640" height="480" />
      </ion-content>
    ];
  }
}
