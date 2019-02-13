/**
 * COPYRIGHT NOXFLY 2019
 * SVG LIB
 * 
 * link: cdn.jsdelivr.net/gh/NoxFly/tools@master/svg/svg.js
 * 
 * svg = new SVG(class name, width, height, background)
 * 
 * draw()       :       display the svg on the screen
 * 
 * line()       :       create <line> element
 *      --> x1, y1, x2, y2, stroke color, stroke width
 * 
 * polyline()   :       create <polyline> element
 *      --> array[] of coordonates, background color (hex or rgb/rgba), stroke color, stroke width
 * 
 * circle()     :       create <circle> element
 *      --> x, y, r, background, stroke color, stroke width
 * 
 * ellipse()    :       create <ellipse> element
 *      --> x, y, rx, ry, background, stroke color, stroke width
 * 
 * arc()        :       create <path> element but for an arc result
 *      --> x, y, r, start anglen end angle, background, stroke color, stroke width
 * 
 * path()       :   create <path> element
 *      --> d, background, stroke color, stroke width
 * 
 * 
 */



class SVG {
    constructor(name, width, height, background) {
        this.width = width || "100%";
        this.height = height || "100%";
        this.background = background || "transparent";
        this.data = [];
        this.name = name;
        this.type = "svg";
        document.body.innerHTML += "<svg class='"+name+"'></svg>";
    }

    draw() {
        document.querySelector("."+this.name).innerHTML = "";
        for(let i in this.data) {
            i = this.data[i];
            let newEl = "<"+i.type+" stroke='"+i.strokeColor+"' stroke-width='"+i.strokeWidth+"' fill='"+i.background+"' ";
            switch(i.type) {
                case "line":
                    newEl = this.createLine(newEl, i);
                    break;
                case "polyline":
                    newEl = this.createPolyline(newEl, i);
                    break;
                case "circle":
                    newEl = this.createCircle(newEl, i);
                    break;
                case "ellipse":
                    newEl = this.createEllipse(newEl, i);
                    break;
                case "path":
                    newEl = this.createArc(newEl, i);
                    break;
            }
            newEl += "/>";
            document.querySelector("."+this.name).innerHTML += newEl;
        }
    }

    line(x1, y1, x2, y2, color, size) {
        x1 = x1 || 0;   y1 = y1 || 0;
        x2 = x2 || 0;   y2 = y2 || 0;
        color = color || "none";
        size = size || 1;
        
        this.data.push({
            type: "line",
            coord: [x1,y1,x2,y2],
            color: color,
            size: size
        });
    }

    polyline(coords, bg, strokeColor, strokeWidth) {
        coords = coords || [];
        bg = bg || "none";
        strokeColor = strokeColor || "none";
        strokeWidth = strokeWidth || 1;
        
        this.data.push({
            type: "polyline",
            coord: coords,
            background: bg,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
        });
    }

    circle(x, y, r, bg, strokeColor, strokeWidth) {
        x = x || 0; y = y || 0; r = r || 0;
        bg = bg || "none";
        strokeColor = strokeColor || "none";
        strokeWidth = strokeWidth || 1;

        this.data.push({
            type: "circle",
            x: x,
            y: y,
            r: r,
            background: bg,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
        });
    }

    ellipse(x, y, rx, ry, bg, strokeColor, strokeWidth) {
        x = x || 0; rx = rx || 0;
        y = y || 0; ry = ry || 0;
        bg = bg || "none";
        strokeColor = strokeColor || "none";
        strokeWidth = strokeWidth || 1;
        this.data.push({
            type: "ellipse",
            x: x,
            y: y,
            rx: rx,
            ry: ry,
            background: bg,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
        });
    }

    arc(x, y, r, startAngle, endAngle, bg, strokeColor, strokeWidth) {
        x = x || 0; y = y || 0;
        startAngle = startAngle || 0;
        endAngle = endAngle || 0;
        bg = bg || "none";
        strokeColor = strokeColor || "none";
        strokeWidth = strokeWidth || 1;

        let start = {
            x: x + (r * Math.cos((endAngle-90) * Math.PI / 180.0)),
            y: y + (r * Math.cos((endAngle-90) * Math.PI / 180.0))
        };

        let end = {
            x: x + (r * Math.cos((startAngle-90) * Math.PI / 180.0)),
            y: y + (r * Math.cos((startAngle-90) * Math.PI / 180.0))
        };

        let arc = endAngle - startAngle <= 180 ? "0" : "1";

        let d = [
            "M", start.x, start.y,
            "A", r, r, 0, arc, 0, end.x, end.y
        ].join(" ");

        this.data.push({
            type: "path",
            d: d,
            background: bg,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
        });
    }

    path(d, bg, strokeColor, strokeWidth) {
        d = d || "";
        bg = bg || "none";
        strokeColor = strokeColor || "none";
        strokeWidth = strokeWidth || 1;

        this.data.push({
            type: "path",
            d: d,
            background: bg,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
        });
    }

    createLine(n, el) {
        n += "x1='"+el.coord[0]+"' y1='"+el.coord[1]+"' x2='"+el.coord[2]+"' y2='"+el.coord[3]+"'";
        return n;
    }

    createPolyline(n, el) {
        let points = "";
        for(let i in el.coord) {
            points += el.coord[i][0]+","+el.coord[i][1];
            if(i<el.coord.length-1) points += " ";
        }

        n += "points='"+ points+"'";
        return n;
    }

    createCircle(n, el) {
        n += "cx='"+el.x+"' cy='"+el.y+"' r='"+el.r+"'";
        return n;
    }

    createEllipse(n, el) {
        n += "cx='"+el.x+"' cy='"+el.y+"' rx='"+el.rx+"' ry='"+el.ry+"'";          
        return n;
    }

    createArc(n, el) {
        n += "d='"+el.d+"'";
        return n;
    }
}