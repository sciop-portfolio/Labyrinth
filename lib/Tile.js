class Tile {
    position;

    constructor(position) {
        this.position = position;
    }

    draw(anchor, tileSize) {}
}

class SimpleTile extends Tile {
    color;
    stroke;

    constructor(position, color, stroke = 0) {
        super(position);
        this.color = color;
        this.stroke = stroke;
    }

    draw(anchor, tileSize) {
        strokeWeight(this.stroke);
        fill(this.color);
        rect(...anchor, ...tileSize);
    }
}

class ImgTile extends Tile {
    img;
    bgCoordinates;
    fgCoordinates;

    constructor(position, color, img, bgCoordinates, fgCoordinates) {
        super(position);
        this.img = img;
        this.bgCoordinates = bgCoordinates;
        this.fgCoordinates = fgCoordinates;
    }

    draw(anchor, tileSize) {
        if(this.bgCoordinates !== undefined) {
            image(this.img, ...anchor, ...tileSize, ...this.bgCoordinates);
        }
        if(this.fgCoordinates !== undefined) {
            image(this.img, ...anchor, ...tileSize, ...this.fgCoordinates);
        }
    }
}

class CharTile extends Tile {
    char;
    color;

    constructor(position, color, char) {
        super(position);
        this.char = char;
        this.color = color;
    }

    draw(anchor, tileSize) {
        textFont('Helvetica');
        textSize(Math.min(tileSize[0]*0.9, tileSize[1]*0.9));
        strokeWeight(0);
        textAlign(CENTER, CENTER);
        fill(this.color);
        let a = anchor.slice();
        a[0] += tileSize[0]/2;
        a[1] += tileSize[1]*0.6;
        text(this.char, ...a);
    }
}

class SimpleTileWithColorVariation extends SimpleTile {
    constructor(position, color, stroke, std) {
        super(position, color, stroke);
        this.color = this.getColor(color, std);
    }

    getColor(color, std) {
        let v = [0, 0, 0];
        for(let i = 0; i < 3; i++) {
            v[i] = gaussian(0, std);
        }
        let c = color;
        let ans = [0, 0, 0];

        ans[0] = red(c) + v[0];
        if(ans[0] < 0) ans[0] = 0;
        if(ans[0] > 255) ans[0] = 255;
        ans[0] = Math.floor(ans[0]);

        ans[1] = green(c) + v[1];
        if(ans[1] < 0) ans[1] = 0;
        if(ans[1] > 255) ans[1] = 255;
        ans[1] = Math.floor(ans[1]);

        ans[2] = blue(c) + v[2];
        if(ans[2] < 0) ans[2] = 0;
        if(ans[2] > 255) ans[2] = 255;
        ans[2] = Math.floor(ans[2]);

        return ans;
    }
}

class RoundedSimpleTile extends SimpleTile {
    ratio;

    constructor(position, color, ratio = 0.25, stroke = 0) {
        super(position, color, stroke);

        this.ratio = ratio;
    }

    draw(anchor, tileSize) {
        strokeWeight(this.stroke);
        fill(this.color);
        let cs = Math.min(tileSize[0], tileSize[1])*this.ratio;
        rect(...anchor, ...tileSize, cs);
    }
}
