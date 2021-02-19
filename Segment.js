const Point = require("./Point");

class Segment {
    constructor(p1, p2) {
        if(p1.x < p2.x) {
            this.p1 = p1;
            this.p2 = p2;
            return;
        }

        if(p1.x > p2.x) {
            this.p1 = p2;
            this.p2 = p1;
            return;
        }

        if(p1.y < p2.y) {
            this.p1 = p1;
            this.p2 = p2;
            return;
        }

        this.p1 = p2;
        this.p2 = p1;
    }

    reverse() {
        return new Segment(this.p2, this.p1);
    }

    difference() {
        return Math.abs(this.p1.x - this.p2.x) > Math.abs(this.p1.y - this.p2.y);
    }

    middle() {
        return new Point((this.p1.x + this.p2.x) / 2,(this.p1.y + this.p2.y ) / 2);
    }

    end(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    contain(point) {
        if ((point.x == this.p1.x && point.y == this.p1.y) || (point.x == this.p2.x && point.y == this.p2.y))
		{
			return true;
		}

        return ( (point.x > this.p1.x && point.x < this.p2.x) || (point.y > this.p1.y && point.y < this.p2.y));
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

        if (this.contain(point) && (segment.contain(point) || segment.end(point))) {
            return point;
        }
			
        return null;
    }

    avoidMultiplePloygons(polygons) {
        var segments = [];
        var segment = this;
        var line = [];
        
        for(var i = 0; i < polygons.length; i++) {
            segments = segment.avoidPolygon(polygons[i]);
            if(i) {
                
                let point = line[line.length - 1];
                //console.log(segments);
                
                /*
                for(var i = 0; i < segments.length; i++) {
                    if(point.p2.equals(segments[i].p2)) {
                        line[line.length - 1] = new Segment(point.p1, segments[i].p2)
                    }
                    if(point.p2.equals(segments[i].p1) ) {
                        line[line.length - 1] = new Segment(point.p1, segments[i].p1)
                    }
                }*/
                
                //console.log(segments);
                //segments[0] = new Segment(line.pop().p2, segments[0].p1);
            }

            //console.log(segments);

            for(var j = 0; j < segments.length; j++) {
                line.push(segments[j]);
            }

            segment = line[segments.length - 1];
            
            if(i != polygons.length -1 && polygons.length - 1 < 2) {
                line.pop();
            }
            
        }

        //console.log(line)

        return line;
    }

    avoidPolygon(polygon, arr = []) {
        let result = this.cross(polygon);
        if(result == true) {

            var point = this.middle();
            var nearest = point.nearest(polygon.crossable, point);
            let first_part = new Segment(this.p1, nearest);

            if (first_part.cross(polygon) == false) {
                arr.push(first_part);
            }
            else {
                var data = first_part.avoidPolygon(polygon);
                for( var i = 0; i < data.length;i++ ) {
                    arr.push(data[i]);
                }
            }

            let second_part = new Segment(nearest,this.p2);
            if (second_part.cross(polygon) == false) {
                arr.push(second_part);
            }
            else {   
                var data = second_part.avoidPolygon(polygon);
                for( var i = 0; i < data.length;i++ ) {
                    arr.push(data[i]);
                }
            }

            return arr;
        }

        if(!arr.length) {
            arr.push(this);
        }

        return arr;
    }
    
    reduce(arr) {
        for(var i = 0; i < arr.length; i++) {
            var segment = new Segment(arr[i][p1], arr[i + 1][p2]);
            if(segment.cross(polygon)) {
            }
        }
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