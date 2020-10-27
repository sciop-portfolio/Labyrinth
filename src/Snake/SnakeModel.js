class SnakeGrid {
    loc;

    appleManager;
    snake;

    state;
    points;
    difficulty;

    constructor(anchor, size, tileSize, margins, bgColor, cellColor, appleColor,
                    snakeHeadColor, snakeTailColor, borderColors, borderWeights,
                    roundedness, relSize, tileVariation, snakeStd) {

        let loc = new Location(anchor, size, tileSize, margins);
        this.loc = loc;
        loc.createBackground(bgColor);
        loc.createEnvironment();
        loc.createItemSet();
        loc.createCharacterSet();
        loc.createBorders(borderColors, borderWeights);

        for(let i = 0; i < size[0]; i++) {
            for(let j = 0; j < size[1]; j++) {
                let t = new SimpleTileWithColorVariation([i, j], cellColor, 0.5, tileVariation);
                loc.registerTile(t);
            }
        }

        this.appleManager = new AppleManager(loc, appleColor, roundedness);
        this.snake = new Snake(loc, this.appleManager, snakeHeadColor, snakeTailColor,
                               roundedness, relSize, snakeStd);

        this.newGame();
    }

    newGame() {
        this.appleManager.reset();
        this.snake.reset();

        this.state = 'pause';
        this.points = 0;
        this.difficulty = 0;
    }

    lose() {
        this.state = 'end';
    }

    step() {

        while(this.appleManager.checkMissing(this.difficulty)) {
            this.appleManager.addApple();
        }
        if(this.state != 'pause' && this.state != 'end') {
            let p = this.snake.step(this.difficulty);
            if(p == -1) {
                this.lose();
            }
            if(p == 1) this.points++;
            this.updateDifficulty();
        }

    }

    draw() {
        this.loc.draw();
    }

    keyStroke(key) {
        if(this.state != 'end') {
            if(key == 'UP_ARROW' || key == 'w') {
                this.snake.changeDir(1);
            } else if(key == 'LEFT_ARROW' || key == 'a') {
                this.snake.changeDir(4);
            } else if(key == 'DOWN_ARROW' || key == 's') {
                this.snake.changeDir(3);
            } else if(key == 'RIGHT_ARROW' || key == 'd') {
                this.snake.changeDir(2);
            }
            if(key == 'p' && this.state != 'pause') {
                this.state = 'pause';
            } else {
                this.state = 'running';
            }
        } else if(key == ' ' || key == 'ENTER' || key == 'BACKSPACE') {
            this.newGame();
        }
    }

    updateDifficulty() {
        //// TODO: fill this, as well as appleplacer checkmissing if multipple apples, and snake step
    }

    getForbidden() {
        let a = [];
        a += appleManager.getForbidden();
        a += snake.getForbidden();

        return a;
    }
}

class AppleManager {
    loc;
    appleColor;
    roundedness;

    apples;

    constructor(loc, appleColor, roundedness) {
        this.loc = loc;
        this.appleColor = appleColor;
        this.roundedness = roundedness;
        this.apples = [];
    }

    isThereAnAppleHere(pos) {
        for(let apple of this.apples) {
            if(apple.position[0] == pos[0] && apple.position[1] == pos[1]) {
               return true;
            }
        }
        return false;
    }

    checkMissing(difficulty) {
        if(this.apples.length == 0) {
            return true;
        }
        return false;
    }

    getForbidden() {
        return [];
    }

    addApple() {

        let forbiddenPlaces = this.getForbidden();

        let done = false;
        while(!done) {
            done = true;
            let i = Math.floor(Math.random()*this.loc.size[0]);
            let j = Math.floor(Math.random()*this.loc.size[1]);

            for(let place of forbiddenPlaces) {
                if(place[0] == i && place[1] == j) done = false;
            }

            if(done) {
                let apple = new RoundedSimpleTile([i, j], this.appleColor, this.roundedness, 4);
                this.loc.registerItem(apple);
                this.apples.push(apple);
            }
        }
    }

    eatApple(pos) {
        for(let i = 0; i < this.apples.length; i++) {
            let apple = this.apples[i];
            if(apple.position[0] == pos[0] && apple.position[1] == pos[1]) {
                this.loc.unRegisterItem(apple);
                this.apples.splice(i, 1);
                return true;
            }

        }
        return false;
    }

    reset() {
        for(let apple of this.apples) {
            this.loc.unRegisterItem(apple);
        }

        this.apples = [];
    }

}

class Snake {
    loc;
    appleManager;
    snakeHeadColor;
    snakeTailColor;
    roundedness;
    relSize;
    std;

    head;

    constructor(loc, appleManager, snakeHeadColor, snakeTailColor, roundedness, relSize, std) {
        this.loc = loc;
        this.appleManager = appleManager;
        this.snakeHeadColor = snakeHeadColor;
        this.snakeTailColor = snakeTailColor;
        this.roundedness = roundedness;
        this.relSize = relSize;
        this.std = std;
    }

    placeHead(forbiddenPlaces) {
        let done = false;
        while(!done) {
            done = true;
            let i = Math.floor(Math.random()*this.loc.size[0]);
            let j = Math.floor(Math.random()*this.loc.size[1]);

            for(let place of forbiddenPlaces) {
                if(place[0] == i && place[1] == j) done = false;
            }

            if(done) {
                this.head = new SnakeHead([i, j], this.snakeHeadColor, this.roundedness, this.relSize, this.snakeTailColor, this.loc, this.std);
            }
        }
    }

    step(difficulty) {
        if(this.head.dir == 0) return 0;

        let apple = this.appleManager.isThereAnAppleHere(this.head.nextPosition());
        if(!this.head.move(apple)) {
            return -1;
        }
        if(apple) {
            this.appleManager.eatApple(this.head.position);
            return 1;
        }
        return 0;
    }

    reset() {
        this.loc.sweepCharacters();

        this.dir = 0;

        this.placeHead([]);
    }

    changeDir(dir) {
        this.head.changeDir(dir);
    }
}

class SnakeHead extends SimpleTileWithColorVariation {
    dir;
    next;
    roundedness;
    tailColor;
    loc;
    std;
    stroke;

    outside;

    constructor(position, color, roundedness, relSize, tailColor, loc, std, stroke = 2) {
        super(position, color, stroke, std);
        this.dir = 0;
        this.roundedness = roundedness;
        this.relSize = relSize;
        this.tailColor = tailColor;
        this.loc = loc;
        this.std = std;
        this.stroke = stroke;
        loc.registerCharacter(this);

        this.outside = false;

    }

    move(isGrowing) {

        if(this.next !== undefined) {
            this.next.move(this.dir, isGrowing);
        }

        if(this.next === undefined && isGrowing) {
            this.next = new SnakeSection(this.position, this.tailColor, this.dir, this.roundedness, this.relSize, this.loc, this.std, this.stroke*2);
        }

        this.position = this.nextPosition();

        if(this.next !== undefined && this.next.checkForBites(this.position)) return false;
        if(this.setOutside()) return false;
        return true;
    }

    nextPosition() {
        let position = this.position.slice();
        switch(this.dir) {
            case 1:
                position[1]--;
                break;
            case 2:
                position[0]++;
                break;
            case 3:
                position[1]++;
                break;
            case 4:
                position[0]--;
                break;
        }
        return position;
    }

    changeDir(newDir) {
        if(this.next !== undefined) {
            let fdir;
            switch (this.next.dir) {
                case 1:
                    fdir = 3;
                    break;
                case 2:
                    fdir = 4;
                    break;
                case 3:
                    fdir = 1;
                    break;
                case 4:
                    fdir = 2;
                    break;

            }
            if(newDir != fdir) this.dir = newDir;
        } else this.dir = newDir;
    }

    draw(anchor, tileSize) {
        if(this.outside) return;
        let corner = Math.min(tileSize[0], tileSize[1])*this.roundedness;

        strokeWeight(this.stroke);
        stroke('black');
        fill(this.color);
        rect(...anchor, ...tileSize, corner);
    }

    setOutside() {
        if(this.position[0] < 0 || this.position[1] < 0 ||
            this.position[0] >= this.loc.size[0] || this.position[1] >= this.loc.size[1]) {

            this.outside = true;
        }

        return this.outside;
    }
}

class SnakeSection extends SimpleTileWithColorVariation {
    dir;
    next;
    roundedness;
    relSize;
    loc;
    std;
    realColor;

    constructor(position, color, dir, roundedness, relSize, loc, std, stroke = 1) {
        super(position, color, stroke, std);
        this.dir = dir;
        this.roundedness = roundedness;
        this.relSize = relSize;
        this.loc = loc;
        this.std = std;
        this.realColor = color;

        loc.registerCharacter(this);
    }

    move(newDir, isGrowing) {
        if(this.next !== undefined) {
            this.next.move(this.dir, isGrowing);
        }

        if(this.next === undefined && isGrowing) {
            this.next = new SnakeSection(this.position.slice(), this.realColor, this.dir, this.roundedness, this.relSize, this.loc, this.std, this.stroke);
        }

        switch(this.dir) {
            case 1:
                this.position[1]--;
                break;
            case 2:
                this.position[0]++;
                break;
            case 3:
                this.position[1]++;
                break;
            case 4:
                this.position[0]--;
                break;
        }

        this.dir = newDir;
    }

    checkForBites(position) {
        if(this.position[0] == position[0] && this.position[1] == position[1]) return true;
        if(this.next != undefined) return this.next.checkForBites(position);
        return false;
    }

    draw(anchor, tileSize) {
        let smallTS = tileSize.slice();
        smallTS[0] *= this.relSize;
        smallTS[1] *= this.relSize;
        let smallA = anchor.slice();
        smallA[0] += (tileSize[0] - smallTS[0])/2;
        smallA[1] += (tileSize[1] - smallTS[1])/2;

        let corner = Math.min(tileSize[0], tileSize[1])*roundedness;

        strokeWeight(this.stroke);
        stroke('black');
        fill(this.color);
        rect(...this.setDims(anchor, smallA, tileSize, smallTS, this.dir), ...this.setCorners(corner, this.dir));
        strokeWeight(0);
        rect(...this.setDims(anchor, smallA, tileSize, smallTS, this.dir), ...this.setCorners(corner, this.dir));
        if(this.next !== undefined) {
            let dir2 = 0;
            if(this.next.dir == 1) dir2 = 3;
            if(this.next.dir == 2) dir2 = 4;
            if(this.next.dir == 3) dir2 = 1;
            if(this.next.dir == 4) dir2 = 2;
            if(dir2 != 0) {
                strokeWeight(this.stroke);
                rect(...this.setDims(anchor, smallA, tileSize, smallTS, dir2), ...this.setCorners(corner, dir2));
                strokeWeight(0);
                rect(...this.setDims(anchor, smallA, tileSize, smallTS, this.dir), ...this.setCorners(corner, this.dir));
                rect(...this.setDims(anchor, smallA, tileSize, smallTS, dir2), ...this.setCorners(corner, dir2));
            }
        }
    }

    setCorners(corner, dir) {
        if(dir == 1) {
            return [0, 0, corner, corner];
        }
        if(dir == 2) {
            return [corner, 0, 0, corner];
        }
        if(dir == 3) {
            return [corner, corner, 0, 0];
        }
        if(dir == 4) {
            return [0, corner, corner, 0];
        }
        return [corner, corner, corner, corner];
    }

    setDims(anchor, smallA, ts, smallTS, dir) {
        if(dir == 1) {
            return [smallA[0], anchor[1], smallTS[0], ts[1] - (ts[1] - smallTS[1])/2];
        }
        if(dir == 2) {
            return [...smallA, ts[0] - (ts[0] - smallTS[0])/2, smallTS[1]];
        }
        if(dir == 3) {
            return [...smallA, smallTS[0], ts[1] - (ts[1] - smallTS[1])/2];
        }
        if(dir == 4) {
            return [anchor[0], smallA[1], ts[0] - (ts[0] - smallTS[0])/2, smallTS[1]];
        }
        return [...smallA, ...smallTS];
    }
}
