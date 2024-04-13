enum CanvasMode {
    BRUSH_MODE = 0,
    DRAG_MODE = 1,
    SELECT_MODE = 2,
    SHAPE_MODE = 3,
    ERASE_MODE = 4,
    OPENPOSE_MODE = 5,
    CROP_MODE = 10,
}

export enum ShapeModeOptions {
    RECTANGLE_SHAPE = 1,
    CIRCLE_SHAPE = 2,
    BRUSH_SHAPE = 3,
    OPENPOSE_SHAPE = 4,
}

export enum CanvasState {
    IDLE = 0,
    DRAWING = 1,
    CROPPING = 2,
    ZOOMING = 3,
    DRAGGING = 4,
    SELECTING = 5,
}

export enum HistoryAction {
    CREATE = 0,
    UPDATE = 1,
    DELETE = 2,
    MOVE = 3
}
  
export default CanvasMode