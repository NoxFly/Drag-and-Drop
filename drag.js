/**
 * COPYRIGHT NOXFLY 2019
 * DRAG & DROP LIB
 * 
 * link: https://cdn.jsdelivr.net/gh/NoxFly/Drag-and-Drop/drag.js
 * 
 * HELPED BY: MrJacz: https://github.com/MrJacz
 * 
 * 
 * 
 * 
 * var $drag = new Drag('div'); // or .class, #id, ...
 * // from now on, all elements will be draggable
 * 
 * options:
 *  - grid: [x, y]
 *  - axis: 'x' || 'y'
 *  - containment: '.container' || '#container' || 'container'
 * 
 * multiple options is possible
 * 
 * var $drag = new Drag('.draggable', {
 *     // options
 * });
 * 
 * $drag.on('event', function() {
 *    // code
 * });
 * 
 * // possible events: dragmove, pointerup, pointerdown
 * 
 * data:
 * access to current dragging element: $drag.dragging
 *  - .$element: html element
 *  - .isDragging: boolean
 *  - .startingPosition: x and y starting position of the element when document loaded
 *  - .relativeStartingPosition: x and y position of the element when last drag start
 *  - .position: x and y current position of the element
 *  - .relativePosition: x and y current position of the element compared to relativeStartingPosition
 *  - .width: width of the element (shortcut)
 *  - .height: height of the element (shortcut)
 * 
 * next updates: 
 * -> add new methods, like:
 *      - destroy()
 *      - disable()
 * 
 */

class Drag {
    constructor(identificator, options=null) {
        this.elements = [];
        this.makeAllDraggable(identificator);
        this.dragging = null;

        this.events = {
            dragmove: new Event('dragmove'),
            pointerup: new Event('pointerup'),
            pointerdown: new Event('pointerdown')
        };

        document.addEventListener('mouseup touchend', () => {
            if(this.dragging) this.dragEnd();
        });

        document.addEventListener('mousemove touchmove', () => {
            if(this.dragging) this.dragMove();
        });

        if(options) {
            if(typeof options === "object") {
                (options.grid && typeof options.grid==="object" && options.grid.length==2) && (this.grid = options.grid);
                (options.containment && typeof options.containment==='string' && document.querySelector(options.containment)) && (this.containment = options.containment);
                (options.axis && ['x','y'].indexOf(options.axis)>-1) && (this.axis = options.axis);
            } else {
                console.warn('options parameter must be object');
            }
            if(this.containment) this.getContainmentCoord();
        }
    }

    makeAllDraggable(identificator) {
        const divs = document.querySelectorAll(identificator);

        for (let i = 0; i < divs.length; i++) {
            const div = divs[i];
            const divX = div.getBoundingClientRect().x,
                  divY = div.getBoundingClientRect().y;

            this.elements[i] = {
                $element: div,
                isDragging: false,
                startingPosition: {x: divX,y: divY},
                position: {x: divX,y: divY},
                relativeStartingPosition: {x: divX,y: divY},
                relativePosition: {x: divX,y: divY},
                dragPoint: {x: null,y: null},
                width: div.clientWidth,
                height: div.clientHeight
            };

            div.addEventListener('pointerdown touchstart', () => this.pointerDown(this.elements[i]));
        }
    }

    getContainmentCoord() {
        var c = document.querySelector(this.containment);
        this.containment = {
            name: this.containment,
            properties: {
                x: c.getBoundingClientRect().x,
                y: c.getBoundingClientRect().y,
                width: c.getBoundingClientRect().width,
                height: c.getBoundingClientRect().height
            }
        };
    }

    pointerDown(el) {
        this.dragging = el;
        document.body.dispatchEvent(this.events.pointerdown);

        this.dragging.dragPoint.x = window.event.clientX - this.dragging.relativeStartingPosition.x;
        this.dragging.dragPoint.y = window.event.clientY - this.dragging.relativeStartingPosition.y;
        
        this.dragging.isDragging = true;
    }

    dragMove() {
        this.dragging.$element.dispatchEvent((this.events.dragmove));

        this.changeElementPosition(window.event.clientX, window.event.clientY);
        this.updateElement();
    }

    dragEnd() {
        document.body.dispatchEvent((this.events.pointerup));

        this.dragging.relativeStartingPosition.x = this.dragging.position.x;
        this.dragging.relativeStartingPosition.y = this.dragging.position.y;

        this.dragging.isDragging = false;
        this.dragging = null;
    }

    on(eventType, callback) {
        for(var i in this.elements)
            this.elements[i].$element.addEventListener(eventType, callback);
    }

    changeElementPosition(x, y) {
        const oldPos = Object.assign({}, this.dragging.position);
        (this.grid && this.moveOnGrid(x, y)) || this.moveLinear(x, y);
        this.containment&&this.checkIsOnContainment(oldPos);
        this.updateRelativePosition();
    }

    updateElement() {
        var el = this.dragging;
        var x = el.position.x - el.startingPosition.x,
            y = el.position.y - el.startingPosition.y;
        
        this.dragging.$element.style.transform = "translate("+x+"px, "+y+"px)";
    }

    moveOnGrid(x, y) {
        var gap = [x-this.dragging.position.x-this.dragging.dragPoint.x, y-this.dragging.position.y-this.dragging.dragPoint.y];
        (!this.axis||this.axis=='x') && (this.dragging.position.x += Math.abs(gap[0])>this.grid[0]? Math.sign(gap[0])*this.grid[0] : 0);
        (!this.axis||this.axis=='y') && (this.dragging.position.y += Math.abs(gap[1])>this.grid[1]? Math.sign(gap[1])*this.grid[1] : 0);
    }

    moveLinear(x, y) {
        (!this.axis||this.axis=='x') && !this.grid && (this.dragging.position.x = x-this.dragging.dragPoint.x);
        (!this.axis||this.axis=='y') && !this.grid && (this.dragging.position.y = y-this.dragging.dragPoint.y);
    }

    updateRelativePosition() {
        this.dragging.relativePosition.x = this.dragging.position.x - this.dragging.startingPosition.x;
        this.dragging.relativePosition.y = this.dragging.position.y - this.dragging.startingPosition.y;
    }

    checkIsOnContainment(old) {
        if(this.dragging.position.x < this.containment.properties.x || this.dragging.position.x+this.dragging.width > this.containment.properties.width)
            this.dragging.position.x = old.x;
        if(this.dragging.position.y < this.containment.properties.y || this.dragging.position.y+this.dragging.height > this.containment.properties.height)
            this.dragging.position.y = old.y;
    }
}