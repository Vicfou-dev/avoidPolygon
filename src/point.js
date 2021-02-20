class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(point) {
        if(Math.abs(this.x - point.x) > 0.00001) {
            return false;
        }
        else if (Math.abs(this.y - point.y) > 0.00001) {
            return false;
        }
        else return true;
    }

    distance(point) {
        var dx = this.x - point.x;
        var dy = this.y - point.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    nearest(points) {
        //var points = Array.from(points);

        for (var i = points.length - 1; i >= 0; --i) {
            if (points[i].x == this.x && points[i].y == this.y) {
                points.splice(i, 1);
            }
        }

        var point = points[0];
        for(var i = 0; i < points.length; i++) {
            if(this.distance(point) >= this.distance(points[i])) {
                point = points[i];
            }
        }
        return point;

    }

}

module.exports = Point;