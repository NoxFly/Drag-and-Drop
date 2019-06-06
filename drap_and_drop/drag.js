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
 * access to current dragging element: $drag.currentDraggingElement
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
        this.currentDraggingElement = null;

        this.events = {
            dragmove: new Event('dragmove'),
            pointerup: new Event('pointerup'),
            pointerdown: new Event('pointerdown')
        };

        document.addEventListener('mouseup', () => {
            if(this.currentDraggingElement) this.dragEnd();
        });

        document.addEventListener('mousemove', () => {
            if(this.currentDraggingElement) this.dragMove();
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
        this.currentDraggingElement = el;
        document.body.dispatchEvent(this.events.pointerdown);

        this.currentDraggingElement.dragPoint.x = window.event.clientX - this.currentDraggingElement.relativeStartingPosition.x;
        this.currentDraggingElement.dragPoint.y = window.event.clientY - this.currentDraggingElement.relativeStartingPosition.y;
        
        this.currentDraggingElement.isDragging = true;
    }

    dragMove() {
        this.currentDraggingElement.$element.dispatchEvent((this.events.dragmove));

        this.changeElementPosition(window.event.clientX, window.event.clientY);
        this.updateElement();
    }

    dragEnd() {
        document.body.dispatchEvent((this.events.pointerup));

        this.currentDraggingElement.relativeStartingPosition.x = this.currentDraggingElement.position.x;
        this.currentDraggingElement.relativeStartingPosition.y = this.currentDraggingElement.position.y;

        this.currentDraggingElement.isDragging = false;
        this.currentDraggingElement = null;
    }

    on(eventType, callback) {
        for(var i in this.elements)
            this.elements[i].$element.addEventListener(eventType, callback);
    }

    changeElementPosition(x, y) {
        this.currentDraggingElement.position.x = x - this.currentDraggingElement.dragPoint.x;
        this.currentDraggingElement.position.y = y - this.currentDraggingElement.dragPoint.y;

        this.currentDraggingElement.relativePosition.x = this.currentDraggingElement.position.x - this.currentDraggingElement.startingPosition.x;
        this.currentDraggingElement.relativePosition.y = this.currentDraggingElement.position.y - this.currentDraggingElement.startingPosition.y;
    }

    updateElement() {
        var el = this.currentDraggingElement;
        var x = el.position.x - el.startingPosition.x,
            y = el.position.y - el.startingPosition.y;
        
        this.currentDraggingElement.$element.style.transform = "translate("+x+"px, "+y+"px)";
    }
}