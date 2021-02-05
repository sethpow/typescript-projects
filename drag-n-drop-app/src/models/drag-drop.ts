// drag n drop interfaces

// add to any class to become draggable
export interface Draggable {
    // use 2 event listeners/handlers
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

// add to any class to become droppable
export interface DragTarget {
    // signal browser/JS that the thing youre dragging something over is a valid drag target; allows for dropping
    dragOverHandler(event: DragEvent): void;
    // react to actual drop/update data or UI
    dropHandler(event: DragEvent): void;
    // any feedback given to user (change background color, etc..)
    dragLeaveHandler(event: DragEvent): void;
}