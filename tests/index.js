const Path = require('../index.js').Path;

const path = new Path({x : 40, y : 10}, { x:100, y : 210 });

path.createObstacle([
    [50, 20],
    [50, 70],
    [100, 70],
    [100, 20]
]);

path.createObstacle([
    [30, 90],
    [30, 130],
    [150, 130],
    [150, 90]
]);

var result = path.find({opti : false, draw : true});
console.log(result);