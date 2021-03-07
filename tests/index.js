const Path = require('../app/index.js').Path;

const path = new Path({
    x: 40,
    y: 10
}, {
    x: 100,
    y: 210
});

path.createObstacle([
    [40,50],
    [50,50],
    [140,100],
    [180,90],
])

var result = path.find({
    optimize: true,
    draw: {
        show: true,
        step: true
    }
});
console.log(result);