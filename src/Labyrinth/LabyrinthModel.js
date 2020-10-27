class ModelVisualElement {
    position;
    baseColor;

    loc;
    view;
    isVisible;

    color;
    alpha;
    isLight;
    percentWhenDark;
    fade;
    tick;

    constructor(location, position, color = 0, fade = 10, pwd = 0.3,
                                                    isVisible = true) {
        this.loc = location;
        this.isVisible = isVisible;
        if(isVisible) this.alpha = 255;
        else this.alpha = 0;
        this.position = position.slice();
        this.baseColor = color;
        this.color = color;
        this.isLight = false;
        this.percentWhenDark = pwd;
        this.fade = fade;
        this.tick = fade;
        this.updateColor();
    }

    updateColor() {
        let level = 1 - this.percentWhenDark*this.tick/this.fade;
        this.color = color(0, 0, 0, this.alpha);
        this.color.setRed(red(color(this.baseColor))*level);
        this.color.setGreen(green(color(this.baseColor))*level);
        this.color.setBlue(blue(color(this.baseColor))*level);
        if(this.view != null) this.view.color = this.color;
        return this.color;
    }

    update() {
        //Behavior
        if(!this.isLight && this.tick < this.fade) {
            this.tick++;
        }
        if(this.isLight && this.tick > 0) {
            this.tick--;
        }

        //View
        if(this.isVisible) this.alpha = 255;
        else this.alpha = 0;
        this.updateColor();
    }
}

class Cell extends ModelVisualElement {

    up;
    down;
    left;
    right;
    wallUp;
    wallDown;
    wallLeft;
    wallRight;
    cornerUpLeft;
    cornerUpRight;
    cornerDownLeft;
    cornerDownRight;

    constructor(...args) {

        super(...args);

        this.view = new SimpleTile(this.position, this.color);

        this.loc.registerTile(this.view);
    }

    update() {
        super.update();

        //Propagate
        if(this.wallRight != null) this.wallRight.update();
        if(this.wallDown != null) this.wallDown.update();
        if(this.left == null && this.wallLeft != null) this.wallLeft.update();
        if(this.up == null && this.wallUp != null) this.wallUp.update();
    }
}

class Wall extends ModelVisualElement {

    strokeWeight;

    constructor(location, position, strokeWeight, color = 0, fade = 10,
                                             pwd = 0.3, isVisible = true) {

        super(location, position, color, fade, pwd, isVisible);

        this.strokeWeight = strokeWeight;
    }
}

class VerticalWall extends Wall {

    left;
    right;
    cornerUp;
    cornerDown;

    constructor(...args) {

        super(...args);

        if(this.isVisible) this.view = new SimpleEdge(this.position, true,
                                                this.strokeWeight, this.color);

        this.loc.registerEdge(this.view);
    }

    update() {
        super.update();

        //Propagate
        if(this.cornerUp != null) this.cornerUp.update();
        if(this.cornerDown != null) this.cornerDown.update();
    }

    getCell(n) {

        if(n == 0) return this.left;
        else return this.right;

    }

    getCorner(n) {

        if(n == 0) return this.cornerUp;
        else return this.cornerDown;

    }
}

class HorizontalWall extends Wall {

    up;
    down;
    cornerLeft;
    cornerRight;

    constructor(...args) {

        super(...args);

        if(this.isVisible) this.view = new SimpleEdge(this.position, false,
                                                this.strokeWeight, this.color);

        this.loc.registerEdge(this.view);
    }

    update() {
        super.update();

        //Propagate
        if(this.cornerLeft != null) this.cornerLeft.update();
        if(this.cornerRight != null) this.cornerRight.update();
    }

    getCell(n) {
        if(n == 0) return this.up;
        else return this.down;
    }

    getCorner(n) {
        if(n == 0) return this.cornerLeft;
        else return this.cornerRight;
    }
}

class Column extends ModelVisualElement {

    wallLeft;
    wallRight;
    wallUp;
    wallDown;

    constructor(location, position, strokeWeight, color = 0, fade = 10,
                                            pwd = 0.3, isVisible = true) {

        super(location, position, color, fade, pwd, isVisible);

        this.strokeWeight = strokeWeight;

        if(this.isVisible) this.view = new SimpleCorner(this.position,
                                            this.strokeWeight, this.color);

        this.loc.registerCorner(this.view);
    }

    update() {
        super.update();
    }
}

class AutoColumn extends Column {
    constructor(...args) {
        super(...args);
    }

    update() {

        if(this.wallLeft == null || this.wallRight == null ||
                                this.wallUp == null || this.wallDown == null) {

            this.isVisible = false;

        } else {
            let countWalls = this.countWalls();

            if(countWalls[0] == 1 || countWalls[1] == 1 && countWalls[2] == 1) {
                this.isVisible = true;
            } else this.isVisible = false;

            if(this.isVisible) {
                if(this.wallLeft.isLight || this.wallUp.isLight ||
                               this.wallDown.isLight || this.wallRight.isLight)
                   this.isLight = true;
                else this.isLight = false;
            }
        }

        super.update();
    }

    countWalls() {
        let ans = [0, 0, 0];
        if(this.wallLeft == null) return [0, 0, 0];
        if(this.wallLeft.isVisible) {
            ans[0]++;
            ans[1]++;
        }
        if(this.wallRight == null) return [0, 0, 0];
        if(this.wallRight.isVisible) {
            ans[0]++;
            ans[1]++;
        }
        if(this.wallUp == null) return [0, 0, 0];
        if(this.wallUp.isVisible) {
            ans[0]++;
            ans[2]++;
        }
        if(this.wallDown == null) return [0, 0, 0];
        if(this.wallDown.isVisible) {
            ans[0]++;
            ans[2]++;
        }
        return ans;
    }
}

class FullGrid {

    cells;

    constructor(loc, cellColor, wallColor, columnColor, wallStroke, columnStroke, fade = 10, pwd = 0.3) {
        this.cells = [];

        for(let i = 0; i < loc.size[0]; i++) {
            let col = [];
            this.cells.push(col);
            for(let j = 0; j < loc.size[1]; j++) {
                let cell = new Cell(loc, [i, j], cellColor, fade, pwd, true);

                if(i == 0) {

                    let lw = new VerticalWall(loc, [i, j], wallStroke, wallColor, fade, pwd);
                    lw.right = cell;
                    cell.wallLeft = lw;

                    let dlc = new AutoColumn(loc, [i, j + 1], columnStroke, columnColor, fade, pwd);
                    lw.cornerDown = dlc;
                    dlc.wallUp = lw;

                    if(j == 0) {

                        let uw = new HorizontalWall(loc, [i, j], wallStroke, wallColor, fade, pwd);
                        uw.down = cell;
                        cell.wallUp = uw;

                        let urc = new AutoColumn(loc, [i + 1, j], columnStroke, columnColor, fade, pwd);
                        uw.cornerRight = urc;
                        urc.wallLeft = uw;

                        let ulc = new AutoColumn(loc, [i, j], columnStroke, columnColor, fade, pwd);
                        lw.cornerUp = ulc;
                        uw.cornerLeft = ulc;
                        ulc.wallDown = lw;
                        ulc.wallRight = uw;

                    } else {
                        cell.up = this.cells[i][j-1];
                        cell.up.down = cell;
                        cell.wallUp = cell.up.wallDown;
                        cell.wallUp.down = cell;
                        lw.cornerUp = cell.wallUp.cornerLeft;
                        lw.cornerUp.wallDown = lw;
                    }
                } else if(j == 0) {

                    let uw = new HorizontalWall(loc, [i, j], wallStroke, wallColor, fade, pwd);
                    uw.down = cell;
                    cell.wallUp = uw;

                    let urc = new AutoColumn(loc, [i+1, j], columnStroke, columnColor, fade, pwd);
                    uw.cornerRight = urc;
                    urc.wallLeft = uw;

                    cell.left = this.cells[i-1][j];
                    cell.left.right = cell;
                    cell.wallLeft = cell.left.wallRight;
                    cell.wallLeft.right = cell;
                    uw.cornerLeft = cell.wallLeft.cornerUp;
                    uw.cornerLeft.wallRight = uw;

                } else {

                    cell.left = this.cells[i-1][j];
                    cell.left.right = cell;

                    cell.wallLeft = cell.left.wallRight;
                    cell.wallLeft.right = cell;

                    cell.up = this.cells[i][j-1];
                    cell.up.down = cell;

                    cell.wallUp = cell.up.wallDown;
                    cell.wallUp.down = cell;
                }

                // anyway...
                // always new wallright, walldown, cornerrightdown
                let rw = new VerticalWall(loc, [i+1, j], wallStroke, wallColor, fade, pwd);
                cell.wallRight = rw;
                rw.left = cell;
                rw.cornerUp = cell.wallUp.cornerRight;
                rw.cornerUp.wallDown = rw;

                let dw = new HorizontalWall(loc, [i, j+1], wallStroke, wallColor, fade, pwd);
                cell.wallDown = dw;
                dw.up = cell;
                dw.cornerLeft = cell.wallLeft.cornerDown;
                dw.cornerLeft.wallRight = dw;

                let drc = new AutoColumn(loc, [i+1, j+1], columnStroke, columnColor, fade, pwd);
                drc.wallLeft = dw;
                dw.cornerRight = drc;
                drc.wallUp = rw;
                rw.cornerDown = drc;

                col.push(cell);
            }
        }
    }

    update() {
        for(let col of this.cells) {
            for(let cell of col) {
                cell.update();
            }
        }
    }
}
