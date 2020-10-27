class Labyrinth {
    loc;
    grid;
    state;

    constructor(anchor, size, tileSize, margins, bgColor, cellColor, wallColor,
                columnColor, borderColors, wallStroke, columnStroke,
                borderWeights, fade, darkness) {

        let loc = new Location(anchor, size, tileSize, margins);
        loc.createBackground(bgColor);
        loc.createEnvironment();
        loc.createBorders(borderColors, borderWeights);

        this.grid = new FullGrid(loc, cellColor, wallColor, columnColor,
                                wallStroke, columnStroke, fade, darkness);

        this.loc = loc;
        this.state = 0;
    }

    draw() {
        this.grid.update();
        this.loc.draw();
    }

    step() {}
}

class LabyrinthPrim extends Labyrinth {
    frontier;

    constructor(...args) {
        super(...args);

        this.frontier = [];
    }

    start() {
        if(this.state == 0) {
            let i = Math.floor(Math.random()*this.grid.cells.length);
            let j = Math.floor(Math.random()*this.grid.cells[0].length);

            this.addCellToLabyrinth(this.grid.cells[i][j]);

            this.state = 1;
        }
    }

    step() {
        if(this.state == 1) {
            while(this.frontier.length > 0) {
                let i = Math.floor(Math.random()*this.frontier.length);
                let wall = this.frontier[i];
                this.frontier.splice(i, 1);
                if(wall.getCell(0) != null && !wall.getCell(0).isMarked) {
                    this.removeWall(wall);
                    this.addCellToLabyrinth(wall.getCell(0));
                    return;
                } else if(wall.getCell(1) != null && !wall.getCell(1).isMarked) {
                    this.removeWall(wall);
                    this.addCellToLabyrinth(wall.getCell(1));
                    return;
                } else {
                    this.markWallAsNonRemoveable(wall);
                }
            }
            this.state = 2;
        }
    }

    addCellToLabyrinth(cell) {
        cell.isMarked = true;
        cell.isLight = true;

        if(!cell.wallLeft.isMarked) this.markWallAsFrontier(cell.wallLeft);
        if(!cell.wallUp.isMarked) this.markWallAsFrontier(cell.wallUp);
        if(!cell.wallRight.isMarked) this.markWallAsFrontier(cell.wallRight);
        if(!cell.wallDown.isMarked) this.markWallAsFrontier(cell.wallDown);
    }

    markWallAsFrontier(wall) {
        wall.isMarked = true;
        this.frontier.push(wall);
    }

    markWallAsNonRemoveable(wall) {
        wall.isLight = true;
    }

    removeWall(wall) {
        wall.isVisible = false;
    }

    getSizeInPixels() {
        return this.loc.getSizeInPixels();
    }
}
