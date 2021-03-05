const Segment = require('./segment.js');
const Point = require('./point.js');
const Polygon = require('./polygon.js');
const Svg = require('./svg');

class Path {
    constructor(start, end) {
        if (start instanceof Point) {
            this.start = start;
        } else if (start.x != undefined && start.y !== undefined) {
            this.start = new Point(start.x, start.y);
        } else throw new Error("Start point invalid");

        if (end instanceof Point) {
            this.end = end;
        } else if (start.x != undefined && end.y !== undefined) {
            this.end = new Point(end.x, end.y);
        } else throw new Error("End point invalid");

        this.obstacles = [];
    }


    createObstacle(polygon) {
        if (polygon instanceof Polygon) {
            this.obstacles.push(polygon);
            return;
        }
        var obstacle = new Polygon();
        for (var i = 0; i < polygon.length; i++) {
            obstacle.addVector(...polygon[i]);
        }

        this.obstacles.push(obstacle);
    }

    setOption(option) {
        if (option.optimize == undefined) {
            option.optimize = false;
        }

        if (option.draw == undefined) {
            option.draw = {};
        }

        if (option.draw.show == undefined) {
            option.draw.show = false;
        }

        if (option.draw.output == undefined) {
            option.draw.output = "index.html";
        }

        if (option.draw.step == undefined) {
            option.draw.step = false;
        }

        if (option.draw.step == undefined) {
            option.draw.output = false;
        }

        if (option.draw.width == undefined) {
            option.draw.width = 1000;
        }

        if (option.draw.height == undefined) {
            option.draw.height = 600;
        }

    }

    getDraw() {
        return (this.svg === null || this.svg === undefined) ? undefined : this.svg.getContent();
    }

    find(option = {}) {

        var inital = new Segment(this.start, this.end);

        this.setOption(option);

        var is_needed_to_draw = option.draw.show;

        if (is_needed_to_draw) {

            this.svg = new Svg();
            this.svg.setWidth(option.draw.width);
            this.svg.setHeight(option.draw.height);
            if (option.draw.step) {
                this.svg.addMultiplePolygons(this.obstacles);
                this.svg.addPoint(this.start);
                this.svg.addPoint(this.end);
                this.svg.draw();

                this.svg.addMultiplePolygons(this.obstacles);
                this.svg.addSegment(segment);
                this.svg.draw();
            }

        }

        var segments = [];
        var line_segments = [];
        var origin = this.end;
        /*
        for(var i = 0 ; i < this.obstacles.length; i++){ 
            for(var j = i +1 ; j < this.obstacles.length; j++){
                console.log(this.obstacles[i].centroid(),this.obstacles[j].centroid());
                if(origin.distance(this.obstacles[i].centroid()) < origin.distance(this.obstacles[j].centroid())){
                    var temp = this.obstacles[j];
                    this.obstacles[j] = this.obstacles[i];
                    this.obstacles[i] = temp;
                }
            }
        }*/

        var polygons = Array.from(this.obstacles);
        
        var tree = [];
        tree[tree.length] = [];
        tree[tree.length - 1][0] = [inital];
        var end = this.end;

        for (var i = 0; i < polygons.length; i++) {
            var lastrow = tree[tree.length - 1]; 
            tree[tree.length] = [];

            for(var j = 0; j < lastrow.length; j++) {
                var segment = lastrow[j][lastrow[j].length - 1];
                var segments = segment.avoidPolygon(polygons[i]);

                var new_row = [];
                for(var p = 0; p < lastrow[j].length - 1; p++) {
                    new_row[new_row.length] = lastrow[j][p];
                }
                
                for(var h = 0; h < segments.length; h++) {
                    new_row[new_row.length] = segments[h];
                }

                tree[tree.length - 1][j] = new_row;
            } 

        }

        const paths = tree[tree.length - 1];
        var min = Infinity;
        var path = [];

        for(var i = 0; i < paths.length; i++) {
            var distance = 0;
            for(var j = 0; j < paths[i].length; j++) {
                distance += paths[i][j].distance();
            }

            if(distance < min) {
                min = distance;
                path = paths[i];
            }

        }

        return path;

        var optimised_path_segments = [];

        var segments = path;

        for (var i = 0; i < segments.length - 1; i++) {

            var segment = segments[i].merge(segments[i + 1]);

            var crossed = false;
            for (var j = 0; j < polygons.length; j++) {
                if(polygons[j].isSegment()) {
                    if(segment.intersection(polygons[j].buildAsSegment()) ) {
                        crossed = true;
                        break;
                    }
                }
                if (segment.cross(polygons[j])) {
                    crossed = true;
                    break;
                }
            }


            if (!crossed) {
                i++;
            } 
            else {
                segment = segments[i];
            }

            if(inital.p1.equals(segment.p1) && inital.p2.equals(segment.p2)) {
                return [inital];
            }
            
            optimised_path_segments[optimised_path_segments.length] = segment;

        }

        var last = segments[segments.length - 1];
        if(optimised_path_segments.length == 0) {
            optimised_path_segments.push(last);
        }

        var p1 = last.p2 !== this.end;
        var p2 = last.p1 !== this.end; 

        if(p1) {
            optimised_path_segments.push(new Segment(last.p2, this.end));
        }

        if(p2 && !p1) {
            optimised_path_segments.push(new Segment(last.p1, this.end));
        }

        return optimised_path_segments;
        

        if (is_needed_to_draw && (!option.draw.optimize || option.draw.step)) {
            this.svg.addMultiplePolygons(this.obstacles);
            this.svg.addMultipleSegments(line_segments);
            this.svg.draw();
            this.svg.save();
        }

        if (!option.optimize) {
            return line_segments;
        }

        var ordered_segments = [];
        var index = 0;
        for(var i = 0; i < line_segments.length; i++) {
            var seg = line_segments[i];
            if(this.start == seg.p1 || this.start == seg.p2) {
                index = i;
                break;
            }
        }
        var current_segment = line_segments.splice(index, 1)[0];
        ordered_segments.push(current_segment);

        while (line_segments.length) {
            var middle = current_segment.middle();

            var points = [];

            for (var i = 0; i < line_segments.length; i++) {
                points.push(line_segments[i].middle());
            }

            var point = middle.nearest(points);

            for (var j = 0; j < points.length; j++) {
                if (point.equals(points[j])) {
                    current_segment = line_segments[j];
                    ordered_segments.push(line_segments.splice(j, 1)[0])
                    break;
                }
            }
        }

        segments = Array.from(ordered_segments);
        var optimised_path_segments = [];

        var inital = new Segment(this.start, this.end);
        
        for (var i = 0; i < segments.length - 1; i++) {

            var segment = segments[i].merge(segments[i + 1]);

            var crossed = false;
            for (var j = 0; j < polygons.length; j++) {
                if(polygons[j].size() <= 2) {
                    if(segment.intersection(new Segment(polygons[j].vectrices[0], polygons[j].vectrices[1])) ) {
                        crossed = true;
                        break;
                    }
                }
                if (segment.cross(polygons[j])) {
                    crossed = true;
                    break;
                }
            }


            if (!crossed) {
                i++;
            } 
            else {
                segment = segments[i];
            }

            if(inital.p1.equals(segment.p1) && inital.p2.equals(segment.p2)) {
                return [inital];
            }
            
            optimised_path_segments[optimised_path_segments.length] = segment;

        }

        var last = segments[segments.length - 1];
        if(optimised_path_segments.length == 0) {
            optimised_path_segments.push(last);
        }

        var p1 = last.p2 !== this.end;
        var p2 = last.p1 !== this.end; 

        if(p1) {
            optimised_path_segments.push(new Segment(last.p2, this.end));
        }

        if(p2 && !p1) {
            optimised_path_segments.push(new Segment(last.p1, this.end));
        }
        
        return optimised_path_segments;


    }
}

module.exports = Path;