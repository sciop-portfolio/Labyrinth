let anchor = [10, 10];
let size = [32, 20];
let tileSize = [20, 20];
let margins = [10, 10, 10, 10];
let bgColor = 220;
let cellColor = [120, 120, 60];
let appleColor = 'red';
let snakeHeadColor = [0, 100, 160];
let snakeTailColor = [60, 90, 120];
let borderColors = ['black', [40, 40, 20, 127]];
let borderWeights = [3, 0.5];
let roundedness = 0.2;
let relSize = 0.6;
let tileVariation = 5;
let snakeColorVariation = 15;

let grid;

let fps = 10;

function setup() {
    this.grid = new SnakeGrid(anchor, size, tileSize, margins, bgColor, cellColor,
                              appleColor, snakeHeadColor, snakeTailColor, borderColors,
                              borderWeights, roundedness, relSize, tileVariation,
                              snakeColorVariation);
    let corner = this.grid.loc.getSizeInPixels();
    corner[0] += anchor[0];
    corner[1] += anchor[1];

    corner[1] += 20;

    createCanvas(...corner);
    frameRate(fps);
}

function draw() {
    this.grid.step();
    this.grid.draw();
}

function keyPressed() {
    switch(keyCode) {
        case LEFT_ARROW:
            this.grid.keyStroke('LEFT_ARROW');
            break;
        case UP_ARROW:
            this.grid.keyStroke('UP_ARROW');
            break;
        case RIGHT_ARROW:
            this.grid.keyStroke('RIGHT_ARROW');
            break;
        case DOWN_ARROW:
            this.grid.keyStroke('DOWN_ARROW');
            break;
        case ENTER:
            this.grid.keyStroke('ENTER');
            break;
        case BACKSPACE:
            this.grid.keyStroke('BACKSPACE');
            break;
     }
     this.grid.keyStroke(key);
}
