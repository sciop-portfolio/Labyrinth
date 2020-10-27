class Tilemap {
    anchor;
    border;
    size;
    tileSize;
    tiles;

    constructor(anchor, border, size, tileSize) {
        this.anchor = anchor;
        this.border = border;
        this.size = size;
        this.tileSize = tileSize;

        this.tiles = [];
    }

    draw() {
        this.drawTiles();
    }

    remake(newAnchor, newBorders = undefined) {
        this.anchor = newAnchor.slice();
        if(newBorders !== undefined) this.border = newBorders[1];
    }

    drawTiles() {
        for(let t of this.tiles) {
            if(t != null) {
                let a = this.anchor.slice();
                a[0] += (this.tileSize[0] + this.border)*t.position[0] + this.border;
                a[1] += (this.tileSize[1] + this.border)*t.position[1] + this.border;
                t.draw(a, this.tileSize);
            }
        }
    }
}

class Environment extends Tilemap {
    edges;
    corners;

    constructor(anchor, border, size, tileSize) {
        super(anchor, border, size, tileSize);

        this.edges = [];

        this.corners = [];
    }

    draw() {
        super.draw();
        this.drawEdges();
        this.drawCorners();
    }

    drawEdges() {
        for(let edge of this.edges) {
            if(edge != null) {
                let a = this.anchor.slice();
                a[0] += (this.tileSize[0] + this.border)*edge.position[0] + this.border;
                a[1] += (this.tileSize[1] + this.border)*edge.position[1] + this.border;
                let b = a.slice();
                if(edge.isVertical) {
                    b[1] += this.tileSize[1] + this.border;
                } else {
                    b[0] += this.tileSize[0] + this.border;
                }
                edge.draw([a, b]);
            }
        }
    }

    drawCorners() {
        for(let corner of this.corners) {
            if(corner != null) {
                let a = this.anchor.slice();
                a[0] += (this.tileSize[0] + this.border)*corner.position[0] + this.border;
                a[1] += (this.tileSize[1] + this.border)*corner.position[1] + this.border;
                corner.draw(a);
            }
        }
    }
}

class IrregularTileMap extends Tilemap {

}
