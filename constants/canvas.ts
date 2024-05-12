import { MdHeight } from "react-icons/md"

enum CanvasMode {
    BRUSH_MODE = 0,
    DRAG_MODE = 1,
    SELECT_MODE = 2,
    SHAPE_MODE = 3,
    ERASE_MODE = 4,
    OPENPOSE_MODE = 5,
}

export enum ShapeModeOptions {
    RECTANGLE_SHAPE = 1,
    CIRCLE_SHAPE = 2,
    BRUSH_SHAPE = 3,
    OPENPOSE_SHAPE = 4,
}

export enum EraseModeOptions {
    ERASE = 0,
    ERASE_ALL = 1,
    ERASE_IMAGE = 2,
}

export enum CanvasState {
    IDLE = 0,
    DRAWING = 1,
    DRAGGING = 2,
    SELECTING = 3,
    ERASING = 4,
    READY = 5,
}

export enum HistoryAction {
    CREATE = 0,
    UPDATE = 1,
    DELETE = 2,
    MOVE = 3
}

export let CANVAS_DIMENSIONS = {
    WIDTH: 1000,
    HEIGHT: 600,
}
  
export default CanvasMode