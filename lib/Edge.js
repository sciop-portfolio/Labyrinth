class Edge {
    position;
    isVertical;

    constructor(position, isVertical) {
        this.position = position;
        this.isVertical = isVertical;
    }

    draw(points){}
}

class SimpleEdge extends Edge {
    strokeWeight;
    color;

    constructor(position, isVertical, strokeWeight, color) {
        super(position, isVertical);
        this.strokeWeight = strokeWeight;
        this.color = color;
    }

    draw(points) {
        stroke(this.color);
        strokeWeight(this.strokeWeight)
        line(...points[0], ...points[1]);
    }
}
