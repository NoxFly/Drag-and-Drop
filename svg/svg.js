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
 * reset()      :       remove all data from SVG (on the screen) --> to undisplay SVG
 * 
 * remove()     :       remove an element from SVG data, or remove all from SVG data (but still display)
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
 * Don't move an element WHILE you didn't draw the SVG: element not existing yet
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
        this.reset();
        for(let j in this.data) {
            let i = this.data[j];
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
                    newEl.setAttributeNS(null, "d", i.d);
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

    reset() {
        if(this.name) document.getElementsByClassName(this.name)[0].innerHTML = "";
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

        if(typeof coords == 'object') {
            if(coords[coords.length-1]===true) coords[coords.length-1] = coords[0];
            coords = this.createPolyline(coords);
        }

        let firstCoords = coords.split(" ")[0];
        coords = coords.replace(/z$/, " "+firstCoords);

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
        if(el) document.querySelector(".s"+el.id).style.display = "none";
        else document.querySelector("."+this.name).style.display = "none";
    }

    show(el) {
        if(el) document.querySelector(".s"+el.id).style.display = "block";
        else document.querySelector("."+this.name).style.display = "block";
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

    moveTo(el, x, y) {
        let object = elementExists(el);
        
        if(!object) {
            console.warn("The element to move must be an SVG element, except a path");
            return false;
        }

        if(isNaN(x) || isNaN(y)) {
            console.warn("Coordonates must be values");
            return false;
        }

        if(el.type=="path") {
            console.warn("Cannot move path for now");
        } else if(/polyline|line/.test(el.type)) {
            this.data[el.id].x1 = x;
            this.data[el.id].y1 = y;
            this.data[el.id].x2 = x + (el.x2-el.x1);
            this.data[el.id].y2 = y + (el.y2-el.y1);
        } else {
            this.data[el.id].x = x;
            this.data[el.id].y = y;
        }

        this.draw();
    }

    createPolyline(coord) {
        let points = "";
        for(let i in coord) {
            points += coord[i][0]+","+coord[i][1];
            if(i<coord.length-1) points += " ";
        }

        return points;
    }

    rect(x, y, width, height, background, strokeColor, strokeWidth) {
        if(isNaN(x)) x = 0;
        if(isNaN(y)) y = 0;
        if(isNaN(width)) width = 0;
        if(isNaN(height)) height = 0;

        return this.polyline(
            [
                [x, y],
                [x+width, y],
                [x+width, y+height],
                [x, y+height],
                true
            ],
            background, strokeColor, strokeWidth
        );
    }
}

function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttributeNS(null, key, attrs[key]);
    }
}

function elementExists(el) {
    try {
        let a = document.querySelector(".s"+el.id);
        return a;
    } catch(error) {
        console.warn("This element does not exists: "+el);
        return false;
    }
}

function hexValue(n) {
    return /#([0-9a-fA-F]){3}/.test(n);
}