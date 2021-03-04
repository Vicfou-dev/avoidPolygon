const Path = require('../index.js').Path;

const path = new Path({
    x: 40,
    y: 10
}, {
    x: 100,
    y: 210
});


var result = path.find({
    optimize: true,
    draw: {
        show: true,
        step: true
    }
});
console.log(result);