class Location {
    anchor;
    background;
    environment;
    items;
    characters;
    effects;
    borders;
    size;
    tileSize;
    margins;

    newAnchor;
    newTileSize;
    framesLeft;

    constructor(anchor = [0, 0], size = [0, 0], tileSize = [0, 0],
                                            margins = [0, 0, 0, 0]) {
        this.anchor = anchor;
        this.size = size;
        this.tileSize = tileSize;
        this.margins = margins;
    }

    getSizeInPixels() {
        let ans = [0, 0];

        ans[0] += this.size[0]*this.tileSize[0];
        ans[0] += this.margins[0] + this.margins[2];

        ans[1] += this.size[1]*this.tileSize[1];
        ans[1] += this.margins[1] + this.margins[3];


        if(this.borders !== undefined) {
            let oh = this.borders.getOverHead();
            if(oh != undefined) {
                ans[0] += oh[0];
                ans[1] += oh[1];
            }
        }

        return ans;
    }

    remake() {
        if(this.background !== undefined) {
            let newSize = this.getSizeInPixels();
            this.background.size = newSize;
        }
        let newAnchor = this.anchor.slice();
        newAnchor[0] += this.margins[0];
        newAnchor[1] += this.margins[1];
        let newBorders;
        if(this.borders !== undefined) {
            this.borders.anchor = newAnchor.slice();
            newAnchor[0] += this.borders.strokes[0];
            newAnchor[1] += this.borders.strokes[0];
            newBorders = this.borders.strokes;
        }
        if(this.environment !== undefined) {
            this.environment.remake(newAnchor, newBorders);
        }
        if(this.items !== undefined) {
            this.items.remake(newAnchor, newBorders);
        }
        if(this.characters !== undefined) {
            this.characters.remake(newAnchor, newBorders);
        }
        if(this.effects !== undefined) {
            this.effects.remake(newAnchor, newBorders);
        }
    }

    draw() {
        if(this.framesLeft > 0) this.updatePosition();
        if(this.background !== undefined) this.background.draw();
        if(this.environment !== undefined) this.environment.draw();
        if(this.items !== undefined) this.items.draw();
        if(this.characters !== undefined) this.characters.draw();
        if(this.effects !== undefined) this.effects.draw();
        if(this.borders !== undefined) this.borders.draw();
    }

    moveTo(newAnchor, newTileSize, frames) {
        this.newAnchor = newAnchor;
        this.newTileSize = newTileSize;
        this.framesLeft = frames;
    }

    updatePosition() {
        this.framesLeft--;
        if(this.framesLeft == 0) {
            this.anchor = this.newAnchor.slice();
            this.tileSize = this.newTileSize.slice();
        } else {
            let step = this.newAnchor[0] - this.anchor[0];
            step = Math.floor(step/this.framesLeft);
            this.anchor[0] += step;
            step = this.newAnchor[1] - this.anchor[1];
            step = Math.floor(step/this.framesLeft);
            this.anchor[1] += step;
            step = this.newTileSize[0] - this.tileSize[0];
            step = Math.floor(step/this.framesLeft);
            this.tileSize[0] += step;
            step = this.newTileSize[1] - this.tileSize[1];
            step = Math.floor(step/this.framesLeft);
            this.tileSize[1] += step;
        }
        this.remake();
    }

    createBackground(color = 255) {
        this.background = new Background(this.anchor,
                                         this.getSizeInPixels(), color);
        this.remake();
    }

    createEnvironment() {
        let a = this.anchor.slice();
        a[0] += this.margins[0];
        a[1] += this.margins[1];
        let b = 0;
        if(this.borders !== undefined) {
            a[0] += this.borders.strokes[0];
            a[1] += this.borders.strokes[0];
            b = this.borders.strokes[1];
        }
        this.environment = new Environment(a, b, this.size, this.tileSize);
        this.remake();
    }

    createItemSet() {
        let a = this.anchor.slice();
        a[0] += this.margins[0];
        a[1] += this.margins[1];
        let b = 0;
        if(this.borders !== undefined) {
            a[0] += this.borders.strokes[0];
            a[1] += this.borders.strokes[0];
            b = this.borders.strokes[1];
        }
        this.items = new Tilemap(a, b, this.size, this.tileSize);
        this.remake();
    }

    createCharacterSet() {
        let a = this.anchor.slice();
        a[0] += this.margins[0];
        a[1] += this.margins[1];
        let b = 0;
        if(this.borders !== undefined) {
            a[0] += this.borders.strokes[0];
            a[1] += this.borders.strokes[0];
            b = this.borders.strokes[1];
        }
        this.characters = new Tilemap(a, b, this.size, this.tileSize);
        this.remake();
    }

    createEffectsSet() {
        let a = this.anchor.slice();
        a[0] += this.margins[0];
        a[1] += this.margins[1];
        let b = 0;
        if(this.borders !== undefined) {
            a[0] += this.borders.strokes[0];
            a[1] += this.borders.strokes[0];
            b = this.borders.strokes[1];
        }
        this.effects = new Tilemap(a, b, this.size, this.tileSize);
        this.remake();
    }

    createBorders(colors = [0, 0], strokes = [3, 1]) {
        let a = this.anchor.slice();
        a[0] += this.margins[0];
        a[1] += this.margins[1];
        let st = strokes.slice();
        if(st[0] < 0) st[0] = 0;
        if(st[1] < 0) st[1] = 0;
        this.borders = new Borders(a, this.size, this.tileSize,
                                   colors, st);
        this.remake();
    }

    registerTile(tile) {
        if(this.environment != null) this.environment.tiles.push(tile);
    }

    registerEdge(edge) {
        if(this.environment != null) this.environment.edges.push(edge);
    }

    registerCorner(corner) {
        if(this.environment != null) this.environment.corners.push(corner);
    }

    registerItem(item) {
        if(this.items != null) this.items.tiles.push(item);
    }

    registerCharacter(char) {
        if(this.characters != null) this.characters.tiles.push(char);
    }

    unRegisterTile(tile) {
        if(this.environment != null) {
            for(let i = 0; i < this.environment.tiles.length; i++) {
                if(tile === this.environment.tiles[i]) {
                    this.environment.tiles.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    unRegisterEdge(edge) {
        if(this.environment != null) {
            for(let i = 0; i < this.environment.edges.length; i++) {
                if(edge === this.environment.edges[i]) {
                    this.environment.edges.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    unRegisterCorner(corner) {
        if(this.environment != null) {
            for(let i = 0; i < this.environment.corners.length; i++) {
                if(corner === this.environment.corners[i]) {
                    this.environment.corners.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    unRegisterItem(item) {
        if(this.items != null) {
            for(let i = 0; i < this.items.tiles.length; i++) {
                if(item === this.items.tiles[i]) {
                    this.items.tiles.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    unRegisterCharacter(char) {
        if(this.characters != null) {
            for(let i = 0; i < this.characters.tiles.length; i++) {
                if(char === this.characters.tiles[i]) {
                    this.characters.tiles.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    sweepItems() {
        if(this.items != null) {
            this.items.tiles = [];
        }
    }

    sweepCharacters() {
        if(this.characters != null) {
            this.characters.tiles = [];
        }
    }
}
