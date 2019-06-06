/**
 * COPYRIGHT NOXFLY 2019
 * DRAG & DROP LIB
 * 
 * link: https://cdn.jsdelivr.net/gh/NoxFly/tools/drap_and_drop/drag.js
 * 
 * HELPED BY: MrJacz: https://github.com/MrJacz
 * 
 * 
 * 
 * 
 * var $drag = new Drag('div'); // or .class, #id, ...
 * // from now on, all elements will be draggable
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
 *  - . relativePosition: x and y current position of the element compared to relativeStartingPosition
 *  - .width: width of the element (shortcut)
 *  - .height: height of the element (shortcut)
 * 
 * next updates: 
 * -> add new methods, like:
 *      - destroy()
 *      - disable()
 * 
 * -> add new events
 * -> add new constructor's options: grid, horizontal, vertical, container
 */

class Drag {
    constructor(identificator) {
        this.elements = [];
        this.makeAllDraggable(identificator);
        this.dragging = null;

        this.events = {
            dragmove: new Event('dragmove'),
            pointerup: new Event('pointerup'),
            pointerdown: new Event('pointerdown')
        };

        document.addEventListener('mouseup', () => {
            if(this.dragging) this.dragEnd();
        });

        document.addEventListener('mousemove', () => {
            if(this.dragging) this.dragMove();
        });

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
                startingPosition: {
                    x: divX,
                    y: divY
                },
                position: {
                    x: divX,
                    y: divY
                },
                relativeStartingPosition: {
                    x: divX,
                    y: divY
                },
                relativePosition: {
                    x: divX,
                    y: divY
                },
                dragPoint: {
                    x: null,
                    y: null
                },
                width: div.clientWidth,
                height: div.clientHeight
            }

            div.setAttribute('draggable','true');
            div.addEventListener('pointerdown', () => this.pointerDown(this.elements[i]));
        }
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
        this.dragging.position.x = x - this.dragging.dragPoint.x;
        this.dragging.position.y = y - this.dragging.dragPoint.y;

        this.dragging.relativePosition.x = this.dragging.position.x - this.dragging.startingPosition.x;
        this.dragging.relativePosition.y = this.dragging.position.y - this.dragging.startingPosition.y;
    }

    updateElement() {
        var el = this.dragging;
        var x = el.position.x - el.startingPosition.x,
            y = el.position.y - el.startingPosition.y;
        
        this.dragging.$element.style.transform = "translate("+x+"px, "+y+"px)";
    }
}