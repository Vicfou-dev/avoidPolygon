const Segment = require('./segment.js');
class graph {
    constructor(points = []) {
        this.points = Array.from(points);
        this.length = points.length;
        this.nodes  = {};
        this.path   = [];
    }

    build(polygons = []) {
        var graph = {};
        for(var i = 0; i < this.points.length; i ++) {
            graph[i] = {};
            for(var j = i + 1; j < this.points.length; j++) {

                var segment = new Segment(this.points[j], this.points[i]);
                var crossed = false;
                for(var h = 0; h < polygons.length; h++) {
                    var result = polygons[h].isSegment() ? segment.intersectionNoEdgeFromPolygon(polygons[h]) : segment.cross(polygons[h]);
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

    dijkstra(start, end) {
        var node = this.points.indexOf(start);
        this.nodes[node] = {weight : 0, prev : null};
        this.end = this.points.indexOf(end);

        this.findNode();

        let previous = this.nodes[this.end].prev;
        let path = [this.end,previous];
        while(previous != node) {
            previous = this.nodes[previous].prev;
            path.push(previous);
        }

        return path.reverse();
    }

    findNode()
    {
        if(this.path.length == this.length) {
            return;
        }

        let smaller = Infinity
        let smallerNode;
        for(const key in this.nodes) {
            if(this.nodes[key].weight < smaller && !this.path.includes(key)) {
                smaller = this.nodes[key].weight;
                smallerNode = key
            }
        }

        const search = {
            graph : this.graph[smallerNode],
            node  : this.nodes[smallerNode]
        };

        for(const key in search.graph) {
            if(this.path.includes(key))
            {
                continue;
            }

            const weight = search.node.weight + search.graph[key]
            const prev   = smallerNode;
            if(this.nodes[key] != null) {
                if(weight < this.nodes[key].weight) {
                    this.nodes[key] = {weight: weight, prev: prev}
                }
            }
            else {
                this.nodes[key] = {weight: weight, prev: prev}
            }
        }

        this.path.push(smallerNode);
        this.findNode();
    }
}

module.exports = graph;