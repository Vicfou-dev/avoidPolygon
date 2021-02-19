const Point = require("./Point.js");

class Polygon {
    constructor() {
        this.vectrices = [];
        this.crossable = [];
    } 

    addVector(x, y) {
        this.vectrices.push(new Point(x, y));
        this.crossable = Array.from(this.vectrices);
    }

    size() {
        return this.vectrices.length;
    }

    index(point) {
        for(var i = 0; i < this.size(); i++) {
            if(this.vectrices[i].equals(point)) {
                return i;
            }
        }

        return -1;
    }

    inside(point) {
        var j = this.size() -1;
        var inside = false;
        
        for(var i = 0; i < this.size(); i++) {

            if(this.vectrices[i].y < point.y && this.vectrices[j].y >= point.y || this.vectrices[j].y < point.y && this.vectrices[i].y >= point.y ) {
                if(this.vectrices[i].x + (point.y - this.vectrices[i].y) / (this.vectrices[j].y - this.vectrices[i].y) * (this.vectrices[j].x - this.vectrices[i].x) < point.x ) {
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
        if (p1_position != -1 && p2_position != -1)
		{
			var pos_distance = Math.abs(p1_position - p2_position);
			if (pos_distance == 1 || pos_distance == this.size()-1) {
                return false;
            }   
				
		}

        var middle = segment.middle();
        return this.inside(middle);
    }
}

module.exports = Polygon;
