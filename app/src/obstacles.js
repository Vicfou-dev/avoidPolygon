const Polygon = require('./polygon.js.js');

class obstacles {

    constructor() {
        this.obstacles = [];
    }

    get(index = -1) {
        if(index == -1) {
            return this.obstacles;
        }

        return this.obstacles[i];
    }

    make(polygon) {
        var obstacle = new Polygon();
        for (var i = 0; i < polygon.length; i++) {
            obstacle.addVector(...polygon[i]);
        }

        return obstacle;
    }

    add(polygon) {
        if (polygon instanceof Polygon) {
            this.obstacles.push(polygon);
            return;
        }
        var obstacle = this.makePolygon(polygon);
        this.obstacles.push(obstacle);
    }

    order(point) {
        for(var i = 0 ; i < this.obstacles.length; i++){ 
            for(var j = i + 1 ; j < this.obstacles.length; j++){
                var point_i = this.obstacles[i].vectrices;
                var point_j = this.obstacles[j].vectrices;
                if(point.distance(point.nearest(point_i)) > point.distance(point.nearest(point_j))){
                    var temp = this.obstacles[j];
                    this.obstacles[j] = this.obstacles[i];
                    this.obstacles[i] = temp;
                }
            }
        }
    }
}

module.exports = obstacles;