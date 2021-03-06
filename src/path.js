const Point = require('./point.js');
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

        this.option = {};
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

        this.option = option;

    }

    setObstacles(manager) {
        this.obstacles = manager
    }

    startDraw() {
        if(!this.option.draw.show) {
            return
        }

        this.svg = new Svg();
        this.svg.setWidth(option.draw.width);
        this.svg.setHeight(option.draw.height);

        if (!option.draw.step) {
            return;
        }

        this.svg.addMultiplePolygons(this.obstacles);
        this.svg.addPoint(this.start);
        this.svg.addPoint(this.end);
        this.svg.draw();

        this.svg.addMultiplePolygons(this.obstacles);
        this.svg.addSegment(inital);
        this.svg.draw();

    }

    endDraw() {
        if (!this.option.draw.show || !this.option.draw.step) {
            return;
        }

        this.svg.addMultiplePolygons(polygons);
        this.svg.addMultipleSegments(shortest_path);
        this.svg.draw();
        this.svg.save();
    }
    

    find(option = {}) {

        this.setOption(option);

        this.startDraw();

        this.obstacles.order(this.start);

        var polygons = this.obstacles.get();

        var points = [];
        points[points.length] = this.start;

        for(var i = 0; i < polygons.length; i++) {
            points = points.concat(polygons[i].getPoints());
        }

        points[points.length] = this.end;
        var graph = new Graph(points);
        graph.build(polygons);

        var shortest_path = graph.shortestPath(this.start, this.end);

        this.endDraw();

        return shortest_path;
    }
}

module.exports = Path;