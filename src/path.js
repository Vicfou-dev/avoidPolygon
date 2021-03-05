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
                this.svg.addSegment(inital);
                this.svg.draw();
            }

        }

        var segments = [];
        var origin = this.start;
        
        
        for(var i = 0 ; i < this.obstacles.length; i++){ 
            for(var j = i +1 ; j < this.obstacles.length; j++){
                var point_i = Array.from(this.obstacles[i].vectrices);
                var point_j = Array.from(this.obstacles[j].vectrices);
                if(origin.distance(origin.nearest(point_i)) > origin.distance(origin.nearest(point_j))){
                    var temp = this.obstacles[j];
                    this.obstacles[j] = this.obstacles[i];
                    this.obstacles[i] = temp;
                }
            }
        }

        var polygons = Array.from(this.obstacles);
        
        var tree = [];
        tree[tree.length] = [];
        tree[tree.length - 1][0] = [inital];

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


        if (is_needed_to_draw && (!option.draw.optimize || option.draw.step)) {
            this.svg.addMultiplePolygons(polygons);
            this.svg.addMultipleSegments(path);
            this.svg.draw();
            this.svg.save();
        }

        return path;
    }
}

module.exports = Path;