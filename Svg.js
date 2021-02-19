const open = require('open');
const path = require('path');
const fs = require('fs');


class Svg {
    constructor() {
        this.figures = [];

        this.height = 600;
        this.width  = 1000;

        this.colors = {
            polygon : "#FF0000",
            segment : "#0000FF",
            point   : "#000000"
        }

        this.output = 'index.html';
        this.content = [];

    }

    addPolygon(polygon) {
        this.figures.push({objet: polygon, type : 'polygon'})
    }

    addSegment(segment) {
        this.figures.push({objet: segment, type : 'segment'})
    }

    addPoint(segment) {
        this.figures.push({objet: segment, type : 'point'})
    }

    open() {
        return open(path.join(__dirname, this.output));
    }

    save() {
        var file = path.join(__dirname, this.output);
        fs.writeFileSync(file,'');
        for(var i = 0; i < this.content.length; i++) {
            fs.appendFileSync(path.join(__dirname, this.output), this.content[i]);
        }
        
    }

    draw() {
        var result = '';
        for(var figure of this.figures) {

            switch(figure.type) {
                case 'polygon':
                    var points = figure.objet.vectrices.map(point => `${point.x},${point.y}`).join(" ");
                    result += `\t<polygon fill="${this.colors[figure.type]}" stroke="${this.colors[figure.type]}" points="${points}" />\n`
                    break;
                case 'point': 
                    result += `\t<circle fill="${this.colors[figure.type]}" cx="${figure.objet.x}" cy="${figure.objet.y}" r="3"/>\n`
                    break;
                case 'segment':

                    result += `\t<circle fill="${this.colors['point']}" cx="${figure.objet.p1.x}" cy="${figure.objet.p1.y}" r="3"/>\n`
                    result += `\t<path stroke="${this.colors[figure.type]}" d="M${figure.objet.p1.x} ${figure.objet.p1.y} L${figure.objet.p2.x} ${figure.objet.p2.y}" />\n`
                    result += `\t<circle fill="${this.colors['point']}" cx="${figure.objet.p2.x}" cy="${figure.objet.p2.y}" r="3"/>\n`
                    break;
            }
        }

        var header = `<svg widht="${this.width}" height="${this.height}">`;
        var bottom = '</svg>';
        var content = "\n"+ header + "\n" + result + bottom + "\n";
        this.content.push(content);
        this.figures = [];

        return content;
    }
}

module.exports = Svg;