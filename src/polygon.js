const Point = require("./point.js");
const Segment = require("./segment.js");

class Polygon {
    constructor() {
        this.vectrices = [];
    }

    addVector(x, y) {
        this.vectrices.push(new Point(x, y));
    }

    size() {
        return this.vectrices.length;
    }
    
    isSegment() {
        return this.size() == 2;
    }

    index(point) {
        for (var i = 0; i < this.size(); i++) {
            if (this.vectrices[i].equals(point)) {
                return i;
            }
        }

        return -1;
    }

    centroid() {
        var centroid = new Point(0, 0);
        for (var i = 0; i < this.size(); i++) {
            var point = this.vectrices[i];
            centroid.x += point.x;
            centroid.y += point.y;
        }

        centroid.x /= this.size();
        centroid.y /= this.size();
        return centroid;
    }

    buildSegments() {
        var segments = [];
        for (var i = 0; i < this.size(); i++)
        {
            var p1 = this.vectrices[i];
			var p2 = this.vectrices[(i + 1) % this.size()];
            segments[segments.length] = new Segment(p1,p2);
        }

        return segments;
    }

    getPoints() {
        var points = [];
        for(var i = 0; i < this.vectrices.length; i++) {
            var find = false;

            for(var j = 0; j < points.length; j++) {
                if(this.vectrices[i].equals(points[j])) {
                    find = true;
                    break;
                }
            }

            if(find == false) {
                points[points.length] = this.vectrices[i];
            }
            
        }
        
        return points;
    }
    

    inside(point) {
        var j = this.size() - 1;
        var inside = false;

        for (var i = 0; i < this.size(); i++) {

            if (this.vectrices[i].y < point.y && this.vectrices[j].y >= point.y || this.vectrices[j].y < point.y && this.vectrices[i].y >= point.y) {
                if (this.vectrices[i].x + (point.y - this.vectrices[i].y) / (this.vectrices[j].y - this.vectrices[i].y) * (this.vectrices[j].x - this.vectrices[i].x) < point.x) {
                    inside = !inside
                }
            }

            j = i;
        }

        return inside;
    }

    cover(segment) {

        var p1_position = this.index(segment.p1);
        var p2_position = this.index(segment.p2);

        if (p1_position != -1 && p2_position != -1) {
            var pos_distance = Math.abs(p1_position - p2_position);
            if (pos_distance == 1 || pos_distance == this.size() - 1) {
                return false;
            }

        }
        
        var middle = segment.middle();
        return this.inside(middle);
    }
}

module.exports = Polygon;