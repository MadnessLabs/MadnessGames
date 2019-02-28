export class Snake {
    /**
     * The canvas element being used to render the game
     */
    canvas: HTMLCanvasElement;
    /**
     * The context of the canvas element (2D)
     */
    ctx: any;
    /**
     * The length of the snake
     */
    snakeSize = 10;
    /**
     * The width of the game screen
     */
    w = 350;
    /**
     * The height of the game screen
     */
    h = 350;
    /**
     * The player's current score
     */
    score = 0;
    /**
     * The snake object 
     */
    snake = null;
    /**
     * The food object
     */
    food = null;
    /**
     * The curent gameloop
     */
    gameLoop: any;
    /**
     * The current direction the snake is headed
     */
    direction: 'right' | 'left' | 'up' | 'down';
    /**
     * The button used to start and restart the game
     */
    btn: HTMLElement;
    /**
     * Are we currently listening for keypress
     */
    isListening = false;

    constructor(canvas: HTMLCanvasElement, button: HTMLElement) {
        this.canvas = canvas ? canvas : (document.getElementById('#snake') as any);
        this.ctx = this.canvas.getContext('2d');
        this.btn = button ? button : document.getElementById('btn');
    }

    start() {
        this.direction = 'down';
        this.drawSnake();
        this.createFood();
        this.gameLoop = setInterval(this.paint, 80);
        if (!this.isListening) {
            this.startKeyListeners();
        }

    }

    startKeyListeners() {
        document.onkeydown = (event) => {
            switch (event.keyCode) {
                case 37:
                    if (this.direction !== 'right') {
                        this.direction = 'left';
                    }
                    console.log('left');
                    break;

                case 39:
                    if (this.direction !== 'left') {
                        this.direction = 'right';
                        console.log('right');
                    }
                    break;

                case 38:
                    if (this.direction !== 'down') {
                        this.direction = 'up';
                        console.log('up');
                    }
                    break;

                case 40:
                    if (this.direction !== 'up') {
                        this.direction = 'down';
                        console.log('down');
                    }
                    break;
            }
        };
    }

    bodySnake(x, y) {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize);
        this.ctx.strokeStyle = 'darkgreen';
        this.ctx.strokeRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize);
    }

    pizza(x, y) {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(x * this.snakeSize + 1, y * this.snakeSize + 1, this.snakeSize - 2, this.snakeSize - 2);
    }

    scoreText() {
        var score_text = "Score: " + this.score;
        this.ctx.fillStyle = 'blue';
        this.ctx.fillText(score_text, 145, this.h - 5);
    }

    drawSnake() {
        var length = 4;
        this.snake = [];
        for (var i = length - 1; i >= 0; i--) {
            this.snake.push({ x: i, y: 0 });
        }
    }

    paint() {
        this.ctx.fillStyle = 'lightgrey';
        this.ctx.fillRect(0, 0, this.w, h);
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(0, 0, this.w, h);
        this.btn.setAttribute('disabled', 'disabled');

        var snakeX = this.snake[0].x;
        var snakeY = this.snake[0].y;

        if (this.direction === 'right') {
            snakeX++;
        }
        else if (this.direction === 'left') {
            snakeX--;
        }
        else if (this.direction === 'up') {
            snakeY--;
        } else if (this.direction === 'down') {
            snakeY++;
        }

        if (snakeX === -1 || snakeX === this.w / this.snakeSize || snakeY === -1 || snakeY === this.h / this.snakeSize || this.checkCollision(snakeX, snakeY, this.snake)) {
            //restart game
            this.btn.removeAttribute('disabled');

            this.ctx.clearRect(0, 0, this.w, this.h);
            this.gameLoop = clearInterval(this.gameLoop);
            return;
        }

        let tail;
        if (snakeX === this.food.x && snakeY === this.food.y) {
            tail = { x: snakeX, y: snakeY }; //Create a new head instead of moving the tail
            this.score++;

            this.createFood(); //Create new food
        } else {
            tail = this.snake.pop(); //pops out the last cell
            tail.x = snakeX;
            tail.y = snakeY;
        }
        //The snake can now eat the this.food.
        this.snake.unshift(tail); //puts back the tail as the first cell

        for (var i = 0; i < this.snake.length; i++) {
            this.bodySnake(this.snake[i].x, this.snake[i].y);
        }

        this.pizza(this.food.x, this.food.y);
        this.scoreText();
    }

    createFood() {
        this.food = {
            x: Math.floor((Math.random() * 30) + 1),
            y: Math.floor((Math.random() * 30) + 1)
        }

        for (var i = 0; i > this.snake.length; i++) {
            var snakeX = this.snake[i].x;
            var snakeY = this.snake[i].y;

            if (this.food.x === snakeX && this.food.y === snakeY || this.food.y === snakeY && this.food.x === snakeX) {
                this.food.x = Math.floor((Math.random() * 30) + 1);
                this.food.y = Math.floor((Math.random() * 30) + 1);
            }
        }
    }

    checkCollision = function (x, y, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x === x && array[i].y === y)
                return true;
        }
        return false;
    }
}