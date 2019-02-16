/**
 * COPYRIGHT NOXFLY 2019
 * SVG LIB
 * 
 * link: cdn.jsdelivr.net/gh/NoxFly/tools@master/svg/svg.js
 * 
 * 
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
 * image()      :       create <image> element
 *      --> URL, width, height, x, y
 * 
 * text()       :       create <text> element
 *      --> text, x, y, font size
 * 
 * hide()       :       hide the SVG or an element of, without transition
 *      --> without argument, hide the SGV, else hide the element of the SVG
 *              --> svg.hide()
 *              --> svg.hide(myCircle1)
 * 
 * show()       :       inverse of the hide method
 *      --> without argument, show the SGV, else show the element of the SVG
 *              --> svg.show()
 *              --> svg.show(myCircle1)
 * 
 * opacity()    :   change element's opacity
 *      --> first argument = opacity value, second is optional, it can be a SVG element
 *              --> svg.opacity(0.5)
 *              --> svg.opacity(0.5, myCircle1)
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
        this.index = 0;
        this.xmlns = "http://www.w3.org/2000/svg";
        
        let elSVG = document.createElementNS(this.xmlns, "svg");
        document.body.appendChild(elSVG);

        elSVG.setAttribute("class", name);
        Object.assign(elSVG.style, {
            width: width,
            height: height,
            background: background,
            display: "inline-block"
        });
    }

    draw() {
        document.getElementsByClassName(this.name).innerHTML = "";
        for(let i in this.data) {
            i = this.data[i];
            let newEl = document.createElementNS(this.xmlns, i.type);
            document.getElementsByClassName(this.name)[0].appendChild(newEl);

            newEl.setAttribute("class", "s"+i.id);
            Object.assign(newEl.style, {
                display: "inline-block",
                stroke: i.strokeColor,
                strokeWidth: i.strokeWidth,
                fill: i.background
            });

            switch(i.type) {
                case "line":
                    setAttributes(newEL, {
                        "x1": i.coord[0],
                        "y1": i.coord[1],
                        "x2": i.coord[2],
                        "y2": i.coord[3]
                    });
                    break;
                case "polyline":
                    newEl.setAttributeNS(null, "points", this.createPolyline(i));
                    break;
                case "circle":
                    setAttributes(newEl, {
                        "cx": i.x,
                        "cy": i.y,
                        "r": i.r
                    });
                    break;
                case "ellipse":
                    setAttributes(newEl, {
                        "x": i.x,
                        "y": i.y,
                        "rx": i.rx,
                        "ry": i.ry
                    });
                    break;
                case "path":
                    newEl.setAttributeNS(null, "d", this.createPath(i));
                    break;
                case "text":
                    setAttributes(newEl, {
                        "x": i.x,
                        "y": i.y,
                        "font-size": i.fontSize
                    });
                    newEl.appendChild(document.createTextNode(i.text));
                    break;
                case "image":
                    setAttributes(newEl, {
                       "x": i.x,
                       "y": i.y,
                       "width": i.width,
                       "height": i.height,
                       "href": i.imageUrl 
                    });
                    break;
            }
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
            size: size,
            id: this.index++
        });
        return this.data[this.index-1];
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
            strokeWidth: strokeWidth,
            id: this.index++
        });
        return this.data[this.index-1];
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
            strokeWidth: strokeWidth,
            id: this.index++
        });
        return this.data[this.index-1];
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
            strokeWidth: strokeWidth,
            id: this.index++
        });
        return this.data[this.index-1];
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
            strokeWidth: strokeWidth,
            id: this.index
        });
        return this.data[this.index-1];
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
            strokeWidth: strokeWidth,
            id: this.index++
        });
        return this.data[this.index-1];
    }

    image(url, width, height, x, y) {
        url = url || "";
        width = width || 0; height = height || 0;
        x = x || 0; y = y || 0;

        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        
        if(http.status == 404) console.error("Image URL not valid: "+url);
        else {
            this.data.push({
                type: "image",
                imageUrl: url,
                x: x,
                y: y,
                width: width,
                height: height,
                id: this.index++
            });
            return this.data[this.index-1];
        }
    }

    text(t, x, y, size) {
        t = t || ""; size = size || "1em";
        x = x || 0; y = y || 0;
        this.data.push({
            type: "text",
            x: x,
            y: y,
            fontSize: size,
            text: t,
            id: this.index++
        });
        return this.data[this.index-1];
    }

    remove(el) {
        if(el) {
            this.data.splice(el.id, 1);
        } else {
            this.data = [];
        }
        this.draw();
    }

    hide(el) {
        if(el) {
            document.querySelector(".s"+el.id).style.display = "none";
        } else {
           document.querySelector("."+this.name).style.display = "none";
        }
    }

    show(el) {
        if(el) {
            document.querySelector(".s"+el.id).style.display = "block";
        } else {
           document.querySelector("."+this.name).style.display = "block";
        }
        this.draw();
    }

    opacity(alpha, el) {
        if(isNaN(alpha)) console.warn("alpha must be a value between 0 and 1");
        else {
            alpha = (alpha>=0 && alpha<=1)? alpha : 1;
            let o = el? ".s"+el.id : "."+this.name;
            document.querySelector(o).style.opacity = alpha;
        }
    }

    createPolyline(el) {
        let points = "";
        for(let i in el.coord) {
            points += el.coord[i][0]+","+el.coord[i][1];
            if(i<el.coord.length-1) points += " ";
        }

        return points;
    }

    createPath(el) {
        let points = "d='"+el.d+"'";
        return points;
    }
}

function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttributeNS(null, key, attrs[key]);
    }
}