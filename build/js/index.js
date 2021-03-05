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

        this.makePolygon = true;

        this.draggables = Draggable.create(".object", this.options);

        this.points = [];

        this.start = new module.Point(40, 10);
        this.createPoint(this.start.x, this.start.y, 'start');

        this.end = new module.Point(300, 410);
        this.createPoint(this.end.x, this.end.y, 'end');

        this.drag();

        this.polygonSelected;

        this.menu = {
            create: document.getElementById('create'),
            save: document.getElementById('save'),
            destroy: document.getElementById('destroy')
        }
        this.svg.addEventListener('click', this.addPointToCache.bind(this))
        this.menu.create.addEventListener('click', this.changeOptionMakingPolygon.bind(this));
        this.menu.save.addEventListener('click', this.savePolygon.bind(this));
        this.menu.destroy.addEventListener('click', this.deletePolygon.bind(this));
        this.changeOptionMakingPolygon();
        this.hideOptionPolygon(false)
    }


    changeOptionMakingPolygon() {
        this.makePolygon = !this.makePolygon;
        this.menu.save.style.display = !this.makePolygon ? 'none' : 'block'
        this.svg.style.cursor = !this.makePolygon ? 'default' : 'crosshair';
        var classname = "polygon" + (this.polygons.length + 1);
        var points = document.querySelectorAll("circle." + classname);
        points.forEach(point => point.remove());
        this.cache = [];
    }

    hideOptionPolygon(param) {
        this.polygonSelected = param;
        this.menu.destroy.style.display = !this.polygonSelected ? 'none' : 'block'
    }

    addPointToCache(event) {
        if (!this.makePolygon) {
            this.hideOptionPolygon(false);
            return;
        }
        var x = event.layerX;
        var y = event.layerY;
        var classname = "polygon" + (this.polygons.length + 1)
        this.cache.push(new module.Point(x, y));
        this.createPoint(x, y, 0, classname);
    }

    deletePolygon() {
        this.polygonSelected.companions.forEach(companion => companion.element.remove());
        this.polygonSelected.target.remove();
        this.hideOptionPolygon(false);
        this.drag();
    }

    savePolygon() {
        if (!this.makePolygon) {
            return;
        }
        this.createPolygon(this.cache, "polygon" + (this.polygons.length + 1));
        var polygon = new module.Polygon();
        for (var i = 0; i < this.cache.length; i++) {
            polygon.addVector(this.cache[i].x, this.cache[i].y);
        }
        this.cache = [];
        this.changeOptionMakingPolygon();
        this.drag();
    }

    createPoint(x, y, id, classname = "") {
        var circle = document.createElementNS(this.ns, "circle");
        if (!id) {
            id = "p" + (Object.keys(this.points).length - 1);
        }
        circle.setAttributeNS(null, "id", id);
        circle.setAttributeNS(null, "fill", "black");
        circle.setAttributeNS(null, "cx", x);
        circle.setAttributeNS(null, "cy", y);
        circle.setAttributeNS(null, "r", 3);
        circle.setAttributeNS(null, "class", "object " + classname);

        this.svg.appendChild(circle);
        var Manager = this;
        var updateCompanions = function () {
            if (!classname) {
                return Manager.drag();
            }
            var polygons = document.querySelectorAll("polygon." + classname);
            var polygon = polygons[0];
            var i = this.companions.length,
                point, points = [];

            while (--i > -1) {
                var point = this.companions[i].element;
                const matrixValues = point.getAttribute('transform').match(/matrix.*\((.+)\)/)[1].split(',')
                const x = parseInt(point.getAttribute('cx'), 10) + parseInt(matrixValues[4], 10)
                const y = parseInt(point.getAttribute('cy'), 10) + parseInt(matrixValues[5], 10)
                points.push(x + ',' + y);
            }

            polygon.removeAttribute("transform");
            polygon.setAttribute("points", points.join(" "));
            Manager.drag();
        }

        var draggable = new Draggable(circle, {
            onPress: function (evt) {
                evt.stopPropagation();
                if (!classname) {
                    return;
                }

                var points = document.querySelectorAll("circle." + classname);
                var i = points.length;
                this.companions = [];
                this.startX = this.x;
                this.startY = this.y;
                while (--i > -1) {
                    this.companions.push({
                        element: points[i],
                        x: points[i]._gsTransform.x,
                        y: points[i]._gsTransform.y
                    });
                }
            },
            onDrag: updateCompanions,
            onThrowUpdate: updateCompanions,
            throwProps: true
        });

        this.draggables.push(draggable);

        if (id) {
            this.points[id] = document.getElementById(id);
        }
    }

    isCollision(elementDOM) {
        var elements = this.getDraggableElements(elementDOM);
        var element = this.makeHitbox(elementDOM);
        if (element instanceof module.Polygon) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i] instanceof module.Point) {
                    if (element.inside(elements[i])) {
                        return elements[i];
                    }
                }

                if (elements[i] instanceof module.Polygon) {
                    for (var j = 0; j < elements[i].vectrices.length; j++) {
                        if (element.inside(elements[i].vectrices[j])) {
                            return elements[i];
                        }
                    }
                }
            }
        }

        if (element instanceof module.Point) {

        }

        return false;
    }

    makeHitbox(elementDOM) {
        var element = this.parseDraggable(elementDOM);
        var size = 20;
        if (element instanceof module.Point) {
            element.x++;
            element.y++;
            return element;
        }

        if (element instanceof module.Polygon) {
            var centroid = element.centroid();
            for (var i = 0; i < element.vectrices.length; i++) {
                if (centroid.x >= element.vectrices[i].x) {
                    element.vectrices[i].x -= size;
                } else {
                    element.vectrices[i].x += size;
                }

                if (centroid.y >= element.vectrices[i].y) {
                    element.vectrices[i].y -= size;
                } else {
                    element.vectrices[i].y += size;
                }
            }
            return element;
        }
    }

    parseDraggable(draggable) {
        var element = draggable.target;
        if (element.tagName == 'circle') {
            const matrixValues = element.getAttribute('transform').match(/matrix.*\((.+)\)/)[1].split(',')
            const x = parseInt(element.getAttribute('cx'), 10) + parseInt(matrixValues[4], 10)
            const y = parseInt(element.getAttribute('cy'), 10) + parseInt(matrixValues[5], 10)
            return new module.Point(x, y);
        }
        if (element.tagName == 'polygon') {
            var points = element.getAttribute('points');
            var polygon = new module.Polygon();
            points.split(' ').map(tab => polygon.addVector(...tab.split(',').map(n => parseInt(n, 10))));
            return polygon;
        }
    }

    getDraggableElements(element) {
        var allowed = ['start', 'end'];
        return this.draggables.filter(draggable => {
            if (draggable.target.tagName == "circle" && !allowed.includes(draggable.target.id)) {
                return false;
            }

            if (draggable.target == element.target) {
                return false
            }

            return true;
        }).map(this.parseDraggable)
    }

    clearSegments() {
        var collection = document.getElementsByClassName(this.classname);
        Array.from(collection).forEach(element => element.remove());
    }

    createSegment(p1, p2) {
        var segment = document.createElementNS("http://www.w3.org/2000/svg", "path");
        segment.setAttributeNS(null, "class", this.classname);
        segment.setAttributeNS(null, "stroke", "blue");
        segment.setAttributeNS(null, "d", `M${p1.x} ${p1.y} L${p2.x} ${p2.y}`);
        this.svg.appendChild(segment);
    }

    createPolygon(points, classname) {
        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        var points = points.map(point => `${point.x},${point.y}`).join(" ");
        polygon.setAttributeNS(null, "stroke", "red");
        polygon.setAttributeNS(null, "fill", "red");
        polygon.setAttributeNS(null, "points", points);
        polygon.setAttributeNS(null, "class", classname);
        this.svg.appendChild(polygon);
        this.polygons.push(polygon);

        var Manager = this;
        var updateCompanions = function (evt) {
            var i = this.companions.length,
                deltaX = this.x - this.startX,
                deltaY = this.y - this.startY,
                companion, polygon, points = [];
            while (--i > -1) {
                var companion = this.companions[i];
                TweenLite.set(companion.element, {
                    x: companion.x + deltaX,
                    y: companion.y + deltaY
                });
                const matrixValues = companion.element.getAttribute('transform').match(/matrix.*\((.+)\)/)[1].split(',')
                const x = parseInt(companion.element.getAttribute('cx'), 10) + parseInt(matrixValues[4], 10)
                const y = parseInt(companion.element.getAttribute('cy'), 10) + parseInt(matrixValues[5], 10)
                points.push(x + ',' + y);
            }

            this.target.removeAttribute("transform");
            this.target.setAttribute("points", points.join(" "));
            var result = Manager.isCollision(this);
            if (!result) {
                Manager.drag();
            } else {
                this.endDrag();
            }
        }
        var draggable = new Draggable(polygon, {
            onPress: function () {
                var boxes = document.querySelectorAll("." + classname);
                var i = boxes.length;
                this.companions = [];
                this.startX = this.x;
                this.startY = this.y;
                while (--i > -1) {
                    if (boxes[i] !== this.target) {
                        this.companions.push({
                            element: boxes[i],
                            x: boxes[i]._gsTransform.x,
                            y: boxes[i]._gsTransform.y
                        });
                    }
                    TweenLite.killTweensOf(classname);
                }
                setTimeout(() => Manager.hideOptionPolygon(this), 25);
            },
            onDrag: updateCompanions,
            onThrowUpdate: updateCompanions,
            throwProps: true
        });

        this.draggables.push(draggable);
    }

    drag(evt) {
        this.clearSegments();

        for (var i = 0; i < this.draggables.length; i++) {

            if (this.draggables[i].target == this.points.start) {
                var pstart = new module.Point(this.start.x + this.draggables[i].x, this.start.y + this.draggables[i].y);
            }

            if (this.draggables[i].target == this.points.end) {
                var pend = new module.Point(this.end.x + this.draggables[i].x, this.end.y + this.draggables[i].y);
            }
        }

        var path = new module.Path(pstart, pend);
        for (var i = 0; i < this.polygons.length; i++) {
            var classname = this.polygons[i].getAttribute('class');
            var points = document.querySelectorAll("circle." + classname);
            var paths = [];
            for (var j = 0; j < points.length; j++) {
                var point = points[j];
                const matrixValues = point.getAttribute('transform').match(/matrix.*\((.+)\)/)[1].split(',')
                const x = parseInt(point.getAttribute('cx'), 10) + parseInt(matrixValues[4], 10)
                const y = parseInt(point.getAttribute('cy'), 10) + parseInt(matrixValues[5], 10)
                paths.push([x, y]);
            }

            path.createObstacle(paths);
        }
        var result = path.find({
            optimize: true
        });

        var segments = Array.from(result);

        segments.forEach(segment => this.createSegment(segment.p1, segment.p2));

    }
}