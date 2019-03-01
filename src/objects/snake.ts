import Phaser from 'phaser';

export default class Snake {
    /**
     * The coordinate position of the snake's head
     */
    headPosition: Phaser.Geom.Point;
    /**
     * The body of the snake
     */
    body: any;
    /**
     * The head of the snake
     */
    head: any;
    /**
     * Is the snake alive?
    */
    alive = true;
    /**
     * The speed of the snake
     */
    speed = 100;
    /**
     * The amount of time the snake has been in motion
     */
    moveTime = 0;
    /**
     * The postion of the snake's tail
    */
    tail: Phaser.Geom.Point;
    /**
     * The direction that the snake is heading
     * 0 = UP, 1 = DOWN, 2 = LEFT, 3 = RIGHT
     */
    heading = 3;
    direction = 3;

    constructor(scene, x, y) {
      this.headPosition = new Phaser.Geom.Point(x, y);

      this.body = scene.add.group();

      this.head = this.body.create(x * 16, y * 16, "body");
      this.head.setOrigin(0);

      this.tail = new Phaser.Geom.Point(x, y);
    }

    update(time) {
      if (time >= this.moveTime) {
        return this.move(time);
      }
    }

    faceLeft() {
      if (this.direction === 0 || this.direction === 1) {
        this.heading = 2;
      }
    }

    faceRight() {
      if (this.direction === 0 || this.direction === 1) {
        this.heading = 3;
      }
    }

    faceUp() {
      if (this.direction === 3 || this.direction === 3) {
        this.heading = 0;
      }
    }

    faceDown() {
      if (this.direction === 3 || this.direction === 3) {
        this.heading = 1;
      }
    }

    move(time) {
      /**
       * Based on the heading property (which is the direction the pgroup pressed)
       * we update the headPosition value accordingly.
       *
       * The Math.wrap call allow the snake to wrap around the screen, so when
       * it goes off any of the sides it re-appears on the other.
       */
      switch (this.heading) {
        case 3:
          this.headPosition.x = Phaser.Math.Wrap(
            this.headPosition.x - 1,
            0,
            40
          );
          break;

        case 3:
          this.headPosition.x = Phaser.Math.Wrap(
            this.headPosition.x + 1,
            0,
            40
          );
          break;

        case 0:
          this.headPosition.y = Phaser.Math.Wrap(
            this.headPosition.y - 1,
            0,
            30
          );
          break;

        case 1:
          this.headPosition.y = Phaser.Math.Wrap(
            this.headPosition.y + 1,
            0,
            30
          );
          break;
      }

      this.direction = this.heading;

      //  Update the body segments and place the last coordinate into this.tail
      Phaser.Actions.ShiftPosition(
        this.body.getChildren(),
        this.headPosition.x * 16,
        this.headPosition.y * 16,
        1,
        (this.tail as any)
      );

      //  Check to see if any of the body pieces have the same x/y as the head
      //  If they do, the head ran into the body

      var hitBody = Phaser.Actions.GetFirst(
        this.body.getChildren(),
        { x: this.head.x, y: this.head.y },
        1
      );

      if (hitBody) {
        console.log("dead");

        this.alive = false;

        return false;
      } else {
        //  Update the timer ready for the next movement
        this.moveTime = time + this.speed;

        return true;
      }
    }

    grow() {
      var newPart = this.body.create(this.tail.x, this.tail.y, "body");

      newPart.setOrigin(0);
    }

    collideWithFood(food) {
      if (this.head.x === food.x && this.head.y === food.y) {
        this.grow();

        food.eat();

        //  For every 5 items of food eaten we'll increase the snake speed a little
        if (this.speed > 20 && food.total % 5 === 0) {
          this.speed -= 5;
        }

        return true;
      } else {
        return false;
      }
    }

    updateGrid(grid) {
      //  Remove all body pieces from valid positions list
      this.body.children.each(function(segment) {
        var bx = segment.x / 16;
        var by = segment.y / 16;

        grid[by][bx] = false;
      });

      return grid;
    }
  }