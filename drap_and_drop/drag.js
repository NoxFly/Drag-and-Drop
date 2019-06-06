/**
 * COPYRIGHT NOXFLY 2019
 * DRAG & DROP LIB
 * 
 * link: cdn.jsdelivr.net/gh/NoxFly/tools@master/drap_and_drop/drag.js
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
 * // possible events: dragstart, dragmove, pointerup, pointerdown
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
            dragStart: new Event('dragstart'),
            dragMove: new Event('dragmove'),
            dragEnd: new Event('pointerup'),
            pointerDown: new Event('pointerdown')
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
            div.addEventListener('dragstart', () => this.dragStart());
            div.addEventListener('dragmove', () => this.dragMove());
            div.addEventListener('pointerdown', () => this.pointerDown(this.elements[i]));
        }
    }

    dragStart() {
        var el = this.currentDraggingElement;
        el.$element.dispatchEvent((this.events.dragStart));

        this.currentDraggingElement.dragPoint.x = window.event.clientX - el.relativeStartingPosition.x;
        this.currentDraggingElement.dragPoint.y = window.event.clientY - el.relativeStartingPosition.y;
        
        this.currentDraggingElement.isDragging = true;
    }

    dragMove() {
        var el = this.currentDraggingElement;
        el.$element.dispatchEvent((this.events.dragMove));

        this.changeElementPosition(window.event.clientX, window.event.clientY);
        this.updateElement();
    }

    dragEnd() {
        var el = this.currentDraggingElement;
        el.$element.dispatchEvent((this.events.dragEnd));

        this.currentDraggingElement.relativeStartingPosition.x = this.currentDraggingElement.position.x;
        this.currentDraggingElement.relativeStartingPosition.y = this.currentDraggingElement.position.y;

        this.currentDraggingElement.isDragging = false;
        this.currentDraggingElement = null;
    }

    pointerDown(el) {
        el.$element.dispatchEvent(this.events.pointerDown);
        this.currentDraggingElement = el;
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