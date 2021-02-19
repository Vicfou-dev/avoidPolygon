const Segment = require('./Segment.js');
const Point = require('./Point.js');
const Polygon = require('./Polygon.js');
const Svg = require('./Svg.js');

var seg = new Segment(new Point(40, 10), new Point(150, 210));
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

const segments = seg.avoidMultiplePloygons([poly]);
svg.addPolygon(poly);
//svg.addPolygon(obstacle);
segments.forEach(segment => svg.addSegment(segment))
svg.draw();
svg.save();

//svg.open();
