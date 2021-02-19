const Segment = require('./Segment.js');

class Path {
    static order(start, end, segments) {

        var _segments = Array.from(segments);
        //segments.slice(1);
        var current_segment = _segments[0];
        var order_segments = [];
        order_segments.push(_segments.shift());
        
        
        while(_segments.length) {
            var middle = current_segment.middle();
            var points = [];

            for(var i = 0; i < _segments.length; i++) {
                points.push(_segments[i].middle());
            }
            var point = middle.nearest(points);
            
            for(var j = 0; j < points.length; j++ ) {
                if(point.equals(points[j])) {
                    current_segment = _segments[j];
                    order_segments.push(_segments.splice(j, 1)[0])
                    break;
                }
            }

            
        }

        return order_segments;   
    }
    static optimize(_segments, obstacles) {

        var segments = Array.from(_segments);
        var opti_segments = [];
        for(var i = 0; i < segments.length - 1; i++) {

            if(segments[i].p1.equals(segments[i + 1].p2) || segments[i].p2.equals(segments[i+1].p2)) {
                var segment = new Segment(segments[i].p1, segments[i + 1].p1)
            }

            if(segments[i].p1.equals(segments[i+1].p1) || segments[i].p2.equals(segments[i+1].p1)) {
                var segment = new Segment(segments[i].p1, segments[i + 1].p2)
            }

            var crossed = false;
            for(var j = 0; j < obstacles.length; j++) {
                if(segment.cross(obstacles[j])) {
                    crossed = true;
                    break;
                }
            }
            
            if(!crossed) {
                i++;
            }      
            else {
                segment = segments[i];
                console.log(segment, i);
            }
            opti_segments.push(segment)
            
        }

        opti_segments.push(segments[segments.length - 1]);
        return opti_segments.filter(n => n);
    }
}

module.exports = Path;