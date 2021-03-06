const Point = require("./point.js");

class Segment {
    constructor(p1, p2) {

        if(p1.x > p2.x) {
            this.p1 = p2;
            this.p2 = p1;
            return;
        }

        this.p1 = p1;
        this.p2 = p2;
    }

    middle() {
        return new Point((this.p1.x + this.p2.x) / 2,(this.p1.y + this.p2.y ) / 2);
    }

    end(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    distance() {
        return this.p1.distance(this.p2);
    }

    isInBox(point) {

        /*
        var ax = this.p1.x - this.p2.x;
        var ay = this.p1.y - this.p2.y;
        var apx = point.x - this.p1.x;
        var apy = point.y - this.p1.y;

        if( ax * apy != ay * apx) {
            return false;
        }*/


        if ((point.x == this.p1.x && point.y == this.p1.y) || (point.x == this.p2.x && point.y == this.p2.y))
		{
			return true;
		}

        return ( (point.x > this.p1.x && point.x < this.p2.x) || (point.y > this.p1.y && point.y < this.p2.y));
    }
    
    intersectionNoEdge(segment) {
        if (this.p1.equals(segment.p1)) {
            return null;
        }

		if (this.p2.equals(segment.p2)) {
            return null 
        }

		if (this.p2.equals(segment.p1)) {
            return null
        }

		if (this.p1.equals(segment.p2)) {
            return null;
        }

        var vx1 = this.p2.x - this.p1.x;
		var vy1 = this.p2.y - this.p1.y;
		var vx2 = segment.p2.x - segment.p1.x;
		var vy2 = segment.p2.y - segment.p1.y;

        var t =  ( vy1 * (segment.p1.x - this.p1.x) - vx1 * (segment.p1.y - this.p1.y)) / ((vx1 * vy2 - vx2 * vy1));
		var _x = Math.ceil(vx2 * t + segment.p1.x);
		var _y = Math.ceil(vy2 * t + segment.p1.y);

        var point = new Point(_x, _y);

        if (this.isInBox(point) && segment.isInBox(point)) {
            return point;
        }

        return null;
    }

    intersection(segment) {
        if (this.p1.equals(segment.p1) || this.p2.equals(segment.p2) || this.p2.equals(segment.p1) || this.p1.equals(segment.p2)) {
            return null;
        }

        var vx1 = this.p2.x - this.p1.x;
		var vy1 = this.p2.y - this.p1.y;
		var vx2 = segment.p2.x - segment.p1.x;
		var vy2 = segment.p2.y - segment.p1.y;

        var t =  ( vy1 * (segment.p1.x - this.p1.x) - vx1 * (segment.p1.y - this.p1.y)) / ((vx1 * vy2 - vx2 * vy1));
		var _x = vx2 * t + segment.p1.x;
		var _y = vy2 * t + segment.p1.y;

        var point = new Point(_x, _y);

        if(this.end(point) ) {
            return null;
        }

        if (this.isInBox(point) && (segment.isInBox(point) || segment.end(point))) {
            return point;
        }
			
        return null;
    }

    cross(polygon) {

        var split_point = null;
        for (var i = 0; i< polygon.size(); i++)
        {
            var p1 = polygon.vectrices[i];
			var p2 = polygon.vectrices[(i + 1) % polygon.size()];
            let edge = new Segment(p1,p2);

            split_point = this.intersection(edge);
            if (split_point != null) {
                break;
            }
        }

        if (split_point != null) 
        {
            let first_part = new Segment(this.p1,split_point).cross(polygon);
            if (first_part == true) {
                return first_part;
            }
            
            let second_part = new Segment(split_point,this.p2).cross(polygon);
            return second_part;
        } 
        else {
            return polygon.cover(this);
        }
        
    }

}

module.exports = Segment;