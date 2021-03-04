const points = {
    start: document.getElementById('start'),
    end: document.getElementById('end')
};

class Manager {
    constructor() {

        this.svg = document.getElementById("area");
        this.ns = "http://www.w3.org/2000/svg";

        this.options = {
            bounds: "svg",
            onDrag: this.drag.bind(this)
        }

        this.classname = 'segment';

        this.polygons = [];

        this.cache = [];

        this.draggables = Draggable.create(".object", this.options);

        this.points = [];

        this.start = new module.Point(40, 10);
        this.createPoint(this.start.x, this.start.y, 'start');

        this.end = new module.Point(100, 210);
        this.createPoint(this.end.x, this.end.y, 'end');

        this.drag();
    }

    addPointToCache(x, y) {

    }

    createPoint(x, y, id) {
        var circle = document.createElementNS(this.ns, "circle");
        if (!id) {
            id = "p" + this.points.length - 1;
        }
        circle.setAttributeNS(null, "id", id);
        circle.setAttributeNS(null, "fill", "black");
        circle.setAttributeNS(null, "cx", x);
        circle.setAttributeNS(null, "cy", y);
        circle.setAttributeNS(null, "r", 3);
        circle.setAttributeNS(null, "class", "object");

        this.svg.appendChild(circle);
        this.draggables.push(new Draggable(circle, this.options));
        if (id) {
            this.points.push({
                logic: new module.Point(x, y),
                dom: document.getElementById(id)
            });
        }
    }
    clearSegments() {
        var collection = document.getElementsByClassName(this.classname);
        Array.from(collection).forEach(element => element.remove());
    }
    createSegment(p1, p2) {
        var segment = document.createElementNS("http://www.w3.org/2000/svg", "path");
        segment.setAttributeNS(null, "class", this.classname);
        segment.setAttributeNS(null, "stroke", "black");
        segment.setAttributeNS(null, "d", `M${p1.x} ${p1.y} L${p2.x} ${p2.y}`);
        this.svg.appendChild(segment);
    }

    createPolygon(points) {
        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var points = pointss.map(point => `${point.x},${point.y}`).join(" ");
        polygon.setAttribute(null, "stroke", "FF0000");
        polygon.setAttribute(null, "fill", "FF0000");
        polygon.setAttribute(null, "stroke", "FF0000");
        polygon.setAttribute(null, "points", points)
        this.svg.appendChild(segment);
        this.draggables.push(new Draggable(polygon, this.options));
    }

    getIndexPoint(element) {

        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].dom == element || this.points[i].dom.id == element) {
                return i;
            }
        }

        return -1;
    }

    getPoint(index) {
        return this.points[index].logic;
    }

    drag(obj) {
        this.clearSegments();

        if (obj == undefined) {
            return;
        }

        var index = this.getIndexPoint(obj.target);

        for (var i = 0; i < this.draggables.length; i++) {
            if (this.draggables[i].target == obj.target) {
                var index = this.getIndexPoint(obj.target);
                console.log(index);
                this.points[index].logic.x = obj.offsetX;
                this.points[index].logic.y = obj.offsetY;
            }
        }

        var pstart = this.getPoint(this.getIndexPoint("start"));
        var pend = this.getPoint(this.getIndexPoint("end"));

        var path = new module.Path(pstart, pend);
        var segments = path.find({
            optimize: true
        });

        segments.forEach(segment => this.createSegment(segment.p1, segment.p2));

    }
}