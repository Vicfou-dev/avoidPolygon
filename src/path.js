const Segment = require('./segment.js');
const Point = require('./point.js');
const Polygon = require('./polygon.js');
const Graph = require('./graph.js');
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

    makePolygon(polygon) {
        var obstacle = new Polygon();
        for (var i = 0; i < polygon.length; i++) {
            obstacle.addVector(...polygon[i]);
        }

        return obstacle;
    }


    createObstacle(polygon) {
        if (polygon instanceof Polygon) {
            this.obstacles.push(polygon);
            return;
        }
        var obstacle = this.makePolygon(polygon);
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

    getPointOfPath(path) {
        var points = [];
        for(var i = 0; i < path.length; i++) {

            var find = false;
            for(var j = 0; j < points.length; j++) {
                if(path[i].p1.equals(points[j])) {
                    find = true;
                    break;
                }
            }

            if(find == false) {
                points[points.length] = path[i].p1;
            }
            
            find = false;
            for(var j = 0; j < points.length; j++) {
                if(path[i].p2.equals(points[j])) {
                    find = true;
                    break;
                }
            }

            if(find == false) {
                points[points.length] = path[i].p2;
            }
        }

        return points;
    }

    orderObstacle(point) {
        for(var i = 0 ; i < this.obstacles.length; i++){ 
            for(var j = i + 1 ; j < this.obstacles.length; j++){
                var point_i = Array.from(this.obstacles[i].vectrices);
                var point_j = Array.from(this.obstacles[j].vectrices);
                if(point.distance(point.nearest(point_i)) > point.distance(point.nearest(point_j))){
                    var temp = this.obstacles[j];
                    this.obstacles[j] = this.obstacles[i];
                    this.obstacles[i] = temp;
                }
            }
        }
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
        
        this.orderObstacle(this.start);

        var polygons = Array.from(this.obstacles);
        
        var paths = [];
        paths[paths.length] = [inital]
        
        for (var i = 0; i < polygons.length; i++) {
            var lastrow = paths[paths.length - 1]; 

            var segment = lastrow[lastrow.length - 1];
                    
            var segments = segment.avoidPolygon(polygons[i]);

            var new_row = [];
            for(var p = 0; p < lastrow.length - 1; p++) {
                new_row[new_row.length] = lastrow[p];
            }
                    
            for(var h = 0; h < segments.length; h++) {
                new_row[new_row.length] = segments[h];
            }

            paths[paths.length] = new_row;

        }

        const path = paths[paths.length - 1];
        var points = this.getPointOfPath(path);
        var graph = new Graph(points);
        graph.build(polygons);

        var edges = graph.dijkstra(this.start, this.end);
        var edges_point = [];
        for(var i = 0; i < points.length; i++) {
            for(var j = 0; j < edges.length; j++) {
                if(edges[j] == i) {
                    edges_point[edges_point.length] = points[i];
                }
            }
        }

        var shortest_path = [];
        for(var i = 0; i < edges_point.length - 1; i++) {
            shortest_path[shortest_path.length] = new Segment(edges_point[i], edges_point[i + 1]);
        }

        if (is_needed_to_draw && (!option.draw.optimize || option.draw.step)) {
            this.svg.addMultiplePolygons(polygons);
            this.svg.addMultipleSegments(shortest_path);
            this.svg.draw();
            this.svg.save();
        }

        return shortest_path;
    }
}

module.exports = Path;