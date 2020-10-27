class Borders {
    anchor;
    size;
    tileSize;
    colors;
    strokes;

    constructor(anchor, size, tileSize, colors, strokes) {
        this.anchor = anchor;
        this.size = size;
        this.tileSize = tileSize;
        this.colors = colors;
        this.strokes = strokes;
    }

    draw() {
        if(this.size[0] > 0 && this.size[1] > 0) {
            this.drawOuter();
            this.drawInner();
        }
    }

    drawOuter() {
        if(this.strokes[0] <= 0) return;
        let h = this.strokes[0]/2;
        let s = this.size.slice();
        s[0] *= this.tileSize[0];
        s[1] *= this.tileSize[1];
        s[0] += (this.size[0] + 1)*this.strokes[1];
        s[1] += (this.size[1] + 1)*this.strokes[1];

        let topLeft = this.anchor.slice();
        topLeft[0] += h;
        topLeft[1] += h;
        let topRight = topLeft.slice();
        topRight[0] += s[0] + 2*h;
        let bottomLeft = topLeft.slice();
        bottomLeft[1] += s[1] + 2*h;
        let bottomRight = topRight.slice();
        bottomRight[1] += s[1] + 2*h;

        stroke(this.colors[0]);
        strokeWeight(this.strokes[0]);
        line(...topLeft, ...topRight);
        line(...topRight, ...bottomRight);
        line(...topLeft, ...bottomLeft);
        line(...bottomLeft, ...bottomRight);
    }

    drawInner() {
        if(this.strokes[1] <= 0) return;
        let o = this.strokes[0];
        let h = this.strokes[1]/2;
        let topLeft = this.anchor.slice();
        topLeft[0] += h + o;
        topLeft[1] += h + o;
        let bottomLeft = topLeft.slice();
        bottomLeft[1] += this.size[1]*this.tileSize[1] + (this.size[1])*2*h;
        let topRight = topLeft.slice();
        topRight[0] += this.size[0]*this.tileSize[0] + (this.size[0])*2*h;



        stroke(this.colors[1]);
        strokeWeight(this.strokes[1]);

        let top = topLeft.slice();
        let bottom = bottomLeft.slice();
        let sum = this.tileSize[0] + this.strokes[1];
        for(let i = 0; i <= this.size[0]; i++) {
            line(...top, ...bottom);
            top[0] += sum;
            bottom[0] += sum;
        }

        let left = topLeft.slice();
        let right = topRight.slice();
        sum = this.tileSize[1] + this.strokes[1];
        for(let i = 0; i <= this.size[1]; i++) {
            line(...left, ...right);
            left[1] += sum;
            right[1] += sum;
        }
    }

    getOverHead() {
        let ans = [0, 0];
        if(this.size[0] > 0 && this.size[1] > 0) {
            ans[0] += this.strokes[0]*2;
            ans[0] += this.strokes[1]*(this.size[0]+1);
            ans[1] += this.strokes[0]*2;
            ans[1] += this.strokes[1]*(this.size[1]+1);
        }

        return ans;
    }
}
