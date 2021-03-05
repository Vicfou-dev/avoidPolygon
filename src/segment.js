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

    merge(segment) {
        if (this.p1.equals(segment.p1)) {
            return new Segment(this.p2, segment.p2);
        }

		if (this.p2.equals(segment.p2)) {
            return new Segment(this.p1, segment.p1);   
        }

		if (this.p2.equals(segment.p1)) {
            return new Segment(this.p1, segment.p2);
        }

		if (this.p1.equals(segment.p2)) {
            return new Segment(this.p2, segment.p1);
        }

        return null;
    }

    distance() {
        return this.p1.distance(this.p2);
    }

    contain(point) {
        if ((point.x == this.p1.x && point.y == this.p1.y) || (point.x == this.p2.x && point.y == this.p2.y))
		{
			return true;
		}

        return ( (point.x > this.p1.x && point.x < this.p2.x) || (point.y > this.p1.y && point.y < this.p2.y));
    }

    cut(segment) {
        if (this.p1.equals(segment.p1)) {
            return this.p2;
        }

		if (this.p2.equals(segment.p2)) {
            return this.p2 
        }

		if (this.p2.equals(segment.p1)) {
            return this.p2
        }

		if (this.p1.equals(segment.p2)) {
            return this.p1
        }

        var vx1 = this.p2.x - this.p1.x;
		var vy1 = this.p2.y - this.p1.y;
		var vx2 = segment.p2.x - segment.p1.x;
		var vy2 = segment.p2.y - segment.p1.y;

        var t =  ( vy1 * (segment.p1.x - this.p1.x) - vx1 * (segment.p1.y - this.p1.y)) / ((vx1 * vy2 - vx2 * vy1));
		var _x = Math.ceil(vx2 * t + segment.p1.x);
		var _y = Math.ceil(vy2 * t + segment.p1.y);

        var point = new Point(_x, _y);

        if (this.contain(point) && segment.contain(point)) {
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

        if (this.contain(point) && (segment.contain(point) || segment.end(point))) {
            return point;
        }
			
        return null;
    }

    avoidPolygon(polygon, arr = []) {
        var result = polygon.encounter(this);

        if(result == true ) {
            var point = this.middle();
            
            var nearest = point.nearest(polygon.crossable, point);
            let first_part = new Segment(this.p1, nearest);
            if (first_part.cross(polygon) == false) {
                
                if(arr.length && polygon.isSegment() == false && arr[arr.length - 1].merge(first_part).cross(polygon) == false) {
                    arr[arr.length - 1] = arr[arr.length - 1].merge(first_part)
                }
                else {
                    arr[arr.length] = first_part;
                }

                console.log(first_part)
            }
            else {
                var data = first_part.avoidPolygon(polygon, []);
                var temp = [];
                for( var i = 0; i < data.length; i++) {
                    if(polygon.index(data[i].p1) != -1 && polygon.index(data[i].p2) != -1) {
                        if(temp.length) {
                            console.log('in')
                            if(temp[i - 1].merge(data[i]).cross(polygon) == false) {
                                temp[i - 1] = temp[i - 1].merge(data[i])
                            }
                            else {
                                temp[temp.length] = data[i];
                            }
                            
                        }
                        else {
                            if(arr.length && arr[arr.length - 1].merge(data[i]).cross(polygon) == false) {
                                arr[arr.length - 1] = arr[arr.length - 1].merge(data[i])
                            }
                            else {
                                temp[temp.length] = data[i];
                            }
                        }
                    }
                    else {
                        temp[temp.length] = data[i];
                    }
                }

                for(var i = 0; i < temp.length; i++) {
                    arr[arr.length] = temp[i];
                }
            }

            let second_part = new Segment(nearest, this.p2);
            if (second_part.cross(polygon) == false) {
                if(arr.length && polygon.isSegment() == false && arr[arr.length - 1].merge(second_part).cross(polygon) == false) {
                    arr[arr.length - 1] = arr[arr.length - 1].merge(second_part)
                }
                else {
                    arr[arr.length] = second_part;
                }

            }
            else {   
                var data = second_part.avoidPolygon(polygon, []);
                var temp = [];
                for( var i = 0; i < data.length; i++) {
                    if(polygon.isSegment() == false && polygon.index(data[i].p1) != -1 && polygon.index(data[i].p2) != -1) {
                        if(temp.length) {
                            if( temp[i - 1].merge(data[i]).cross(polygon) == false) {
                                temp[i - 1] = temp[i - 1].merge(data[i])
                            }
                            else {
                                temp[temp.length] = data[i];
                            }
                            
                        }
                        else {
                            if(arr.length && arr[arr.length - 1].merge(data[i]).cross(polygon) == false) {
                                arr[arr.length - 1] = arr[arr.length - 1].merge(data[i])
                            }
                            else {
                                temp[temp.length] = data[i];
                            }
                        }
                    }
                    else {
                        temp[temp.length] = data[i];
                    }
                }

                for(var i = 0; i < temp.length; i++) {
                    arr[arr.length] = temp[i];
                }
            }

            console.log(arr)
            
            return arr;
        }

        if(!arr.length) {
            arr[arr.length] = this;
        }
        
        return arr;
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