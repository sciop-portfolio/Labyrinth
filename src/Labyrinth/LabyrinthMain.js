let main;
let side1;
let side2;
let framesPerSecond = 30;
let framesPerStep = 1;
let frameCounter;

// Params
let anchor = [10, 10];
let size = [16, 16];
let tileSize = [48, 48];
let margins = [10, 10, 10, 10];
let bgColor = 220;
let cellColor = 'white';
let wallColor = 'grey';
let columnColor = 'grey';
let borderColors = ['black', 'black'];
let markedColor = [120, 200, 120];
let wallStroke = 8;
let columnStroke = 12;
let borderWeights = [16, 0];
let fade = 10;
let darkness = 0.6;

let canvasSize;

let paused = false;

function setup() {

    newMain();

    frameCounter = framesPerSecond;

    canvasSize = main.getSizeInPixels();
    canvasSize[0] += anchor[0];
    canvasSize[1] += anchor[1];

    createCanvas(...canvasSize);

    frameRate(framesPerSecond);
}

function draw() {
    frameCounter--;
    if(frameCounter == 0) {
        frameCounter = framesPerStep;
        if(!paused) main.step();
        if(main.state == 0) {
            main.start();
        } else if(main.state == 3) {
            newMain();
        } else if(main.state == 2) {
            main.state = 3;
            frameCounter = 3*framesPerSecond;
        }
    }
    main.draw();
}

function keyPressed() {
    if(key == 'p') paused = !paused;
}

function newMain() {
    main = new LabyrinthPrim(anchor, size, tileSize, margins, bgColor,
                    cellColor, wallColor, columnColor,
                    borderColors, wallStroke, columnStroke, borderWeights, fade,
                    darkness);
}
