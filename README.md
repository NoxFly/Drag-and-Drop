# Drag and Drop library

### current CDN link:
```js
<script src='https://cdn.jsdelivr.net/gh/NoxFly/drap_and_drop/drag.min.js'></script>
```

I'll add it on npm and unpkg soon.

**Works without Jquery**
**Works on phones**

It use `transform: translate();` css property, so if you set a new transform property, element cannot be dragged.

other cool library: [SVG library](http://github.com/NoxFly/SVG)

### Usage

```js
var drag = new Drag('elem'); // elem can be .class, #id or tag name
// all these elements are now draggable !

// multi use :
var drags = [
    new Drag('.class'),
    new Drag('#id'),
    new Drag('tag')
];

// it can be object :
var drags = {
    type_1: new Drag('.class'),
    type_2: new Drag('#id'),
    type_3: new Drag('tag')
};
```

### Options

```js
// possible options: axis, grid, container
// you can set 1, 2 or 3 options on same Drag

var drag = new Drag('elem', {
    axis: 'x' || 'y', // choose x or y - string type
    grid: [10,50], // choose a Xstep and Ystep. Even if you set x axis, you must write Ystep - array type
    containment: 'elem2' // choose the non-traversable area of draggable elem - string type
});
```

### Listeners

```js
// possible event: dragmove, pointerup, pointerdown
drag.on('event', () => { // function() {}
    // code
});
```

### Access to dragging element

```js
drag.dragging = {
    $element: , // html element (document.querySelector())
    isDragging: true,
    width: ,    // html element width (shortcut of drag.dragging.$element.getBoundingClientRect().width)
    height: ,   // html element height (shortcut of drag.dragging.$element.getBoundingClientRect().height)
    position: {
        x: ,    // current X position of element while dragging - relative to the page
        y:      // current Y position of element while dragging - relative to the page
    },
    relativePosition: {
        x: ,    // current X position of element while dragging - relative to the last drop position
        y:      // current Y position of element while dragging - relative to the last drop position
    },
    startingPosition: {
        x: ,    // X position of element while dragging - relative to the page
        y:      // Y position of element while dragging - relative to the page
    },
    relativeStartingPosition: {
        x: ,    // X position of element while dragging - relative to the last drop position
        y:      // Y position of element while dragging - relative to the last drop position
    }
}
```

Next updates will add more possibilities