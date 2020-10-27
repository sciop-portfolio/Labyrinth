function gaussian(mean, stddev) {
    let u, v, r;
    while(r == undefined || r < 0 || r >= 1) {
        u = 2*Math.random() - 1;
        v = 2*Math.random() - 1;
        r = u*u+v*v;
    }
    let c = Math.sqrt(-2*Math.log(r)/r);

    return mean + u*c*stddev;
}
