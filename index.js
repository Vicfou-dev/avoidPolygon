const Segment = require('./src/segment.js');
const Point = require('./src/point.js');
const Polygon = require('./src/polygon.js');
const Path = require('./src/path.js');
const Svg = require('./src/svg.js');

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
/*
var seg = new Segment(new Point(40, 10), new Point(100, 210));
var poly = new Polygon();

var obstacle = new Polygon();

poly.addVector(50,20);
poly.addVector(50,70);
poly.addVector(100,70);
poly.addVector(100,20);


obstacle.addVector(30,90);
obstacle.addVector(30,130);
obstacle.addVector(150,130);
obstacle.addVector(150,90);


const svg = new Svg();
svg.addPolygon(poly);
svg.addPolygon(obstacle);
svg.addPoint(seg.p1);
svg.addPoint(seg.p2);
svg.draw();

svg.addPolygon(poly);
svg.addPolygon(obstacle);
svg.addSegment(seg);
svg.draw();

var obstacles = [poly, obstacle];

var segments = seg.avoidMultiplePloygons(obstacles);
segments = Path.order(seg.p1, seg.p2, segments);
segments = Path.optimize(segments, obstacles)


svg.addPolygon(poly);
svg.addPolygon(obstacle);
segments.forEach(segment => svg.addSegment(segment))
svg.draw();
svg.save();

//svg.open();*/
