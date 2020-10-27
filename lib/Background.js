class Background {
    anchor;
    size;
    color;

    constructor(anchor, size, color) {
        this.anchor = anchor;
        this.size = size;
        this.color = color;
    }

    draw() {
        strokeWeight(0);
        fill(this.color);
        rect(...this.anchor, ...this.size);
    }
}
