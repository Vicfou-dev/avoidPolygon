const Segment = require('./segment.js');
const Point = require('./point.js');
const Polygon = require('./polygon.js');
const Svg = require('./svg');

class Path {
    constructor(start, end) {
        if(start instanceof Point) {
            this.start = start;
        }
        else if(start.x != undefined && start.y !== undefined) {
            this.start = new Point(start.x, start.y);
        }
        else throw new Error("Start point invalid");
        
        if(end instanceof Point) {
            this.end = end;
        }
        else if(start.x != undefined && end.y !== undefined) {
            this.end = new Point(end.x, end.y);
        }
        else throw new Error("End point invalid");

        this.obstacles = [];
    }


    createObstacle(polygon) {
        if(polygon instanceof Polygon) {
            this.obstacles.push(polygon);
            return;
        }
        var obstacle = new Polygon();
        for(var i = 0; i < polygon.length;i ++) {
            obstacle.addVector(...polygon[i]);
        }

        this.obstacles.push(obstacle);
    }

    find(option = {}) {
        if(option.optimize == undefined) {
            option.optimize = false;
        }

        if(option.draw == undefined) {
            option.draw = false;
        }

        var segment = new Segment(this.start, this.end);

        if(option.draw) {
            if(option.output == undefined) {
                option.output = "index.html";
            }
    
            this.svg = new Svg();
            this.svg.addMultiplePolygons(this.obstacles);
            this.svg.addPoint(this.start);
            this.svg.addPoint(this.end);
            this.svg.draw();

            this.svg.addMultiplePolygons(this.obstacles);
            this.svg.addSegment(segment);
            this.svg.draw();
        }

        var segments = [];
        var line_segments = [];
        var polygons = Array.from(this.obstacles);

        for(var i = 0; i < polygons.length; i++) {
            segments = segment.avoidPolygon(polygons[i]);

            for(var j = 0; j < segments.length; j++) {
                line_segments.push(segments[j]);
            }

            segment = line_segments[segments.length - 1];
            
            if(i != polygons.length -1 && polygons.length - 1 < 2) {
                line_segments.pop();
            }
            
        }

        if(!option.opti) {
            if(option.draw) {

                this.svg.addMultiplePolygons(this.obstacles);
                this.svg.addMultipleSegments(line_segments);
                this.svg.draw();
                this.svg.save();

            }
            return line_segments; 
        }

        var ordered_segments = [];
        var current_segment  = line_segments.shift();
        ordered_segments.push(current_segment);

        while(line_segments.length) {
            var middle = current_segment.middle();

            var points = [];

            for(var i = 0; i < line_segments.length; i++) {
                points.push(line_segments[i].middle());
            }

            var point = middle.nearest(points);
            
            for(var j = 0; j < points.length; j++ ) {
                if(point.equals(points[j])) {
                    current_segment = line_segments[j];
                    ordered_segments.push(line_segments.splice(j, 1)[0])
                    break;
                }
            }
        }

        segments = ordered_segments;
        var optimised_path_segments = [];

        for(var i = 0; i < segments.length - 1; i++) {

            if(segments[i].p1.equals(segments[i + 1].p2) || segments[i].p2.equals(segments[i+1].p2)) {
                var segment = new Segment(segments[i].p1, segments[i + 1].p1)
            }

            if(segments[i].p1.equals(segments[i+1].p1) || segments[i].p2.equals(segments[i+1].p1)) {
                var segment = new Segment(segments[i].p1, segments[i + 1].p2)
            }

            var crossed = false;
            for(var j = 0; j < polygons.length; j++) {
                if(segment.cross(polygons[j])) {
                    crossed = true;
                    break;
                }
            }
            
            if(!crossed) {
                i++;
            }      
            else {
                segment = segments[i];
                console.log(segment, i);
            }
            
            optimised_path_segments.push(segment)
            
        }

        optimised_path_segments.push(segments[segments.length - 1]);
        if(option.draw) {

            this.svg.addMultiplePolygons(this.obstacles);
            this.svg.addMultipleSegments(optimised_path_segments);
            this.svg.draw();
            this.svg.save();

        }
        return optimised_path_segments;


    }
}

module.exports = Path;