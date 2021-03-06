const Dijkstra = require('./dijkstra.js');
const Segment = require('./segment.js');

class graph {
    constructor(points = []) {
        this.points = points;
        this.graph  = {};
    }

    build(polygons = []) {
        var graph = {};
        for(var i = 0; i < this.points.length; i ++) {
            graph[i] = {};
            for(var j = i + 1; j < this.points.length; j++) {

                var segment = new Segment(this.points[j], this.points[i]);
                var crossed = false;
                for(var h = 0; h < polygons.length; h++) {
                    var result = polygons[h].isSegment() ? segment.intersectionNoEdge(polygons[h].buildSegments()[0]) : segment.cross(polygons[h]);
                    if(result) {
                        var crossed = true;
                        break;
                    }
                }

                if(!crossed) {
                    graph[i][j] = segment.distance();
                }
            }
        }

        this.graph = graph;
    }

    shortestPath(start, end) {
        var algo = new Dijkstra(this.graph);
        console.log(this.points.indexOf(start),this.points.indexOf(end))
        var edges = algo.exec(this.points.indexOf(start), this.points.indexOf(end));

        console.log(edges);
        var edges_point = [];
        for(var i = 0; i < this.points.length; i++) {
            for(var j = 0; j < edges.length; j++) {
                if(edges[j] == i) {
                    edges_point[edges_point.length] = this.points[i];
                }
            }
        }

        var shortest_path = [];
        for(var i = 0; i < edges_point.length - 1; i++) {
            shortest_path[shortest_path.length] = new Segment(edges_point[i], edges_point[i + 1]);
        }

        return shortest_path;
    }
}

module.exports = graph;