class Corner {
    position;

    constructor(position) {
        this.position = position;
    }

    draw(anchor){}
}

class SimpleCorner extends Corner {
    strokeWeight;
    color;

    constructor(position, strokeWeight, color) {
        super(position);
        this.strokeWeight = strokeWeight;
        this.color = color;
    }

    draw(anchor) {
        stroke(this.color);
        strokeWeight(this.strokeWeight);
        point(...anchor);
    }
}
