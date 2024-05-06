import { HistoryAction } from "@/constants/canvas"
import { Dispatch, SetStateAction } from "react"

export const drawInitialRectangle = (
  context: CanvasRenderingContext2D,
  initialRectPosition: {
    x: number;
    y: number;
    w: number;
    h: number;
  },
  panOffset: { x: number; y: number },
  isInitialBorderExist: boolean = true,
  image: HTMLImageElement | null,
  theme: string | undefined,
  callback: () => void,
) => {
 context.beginPath();
  let backgroundColor = "transparent";
  if (theme === "dark") {
    backgroundColor = "#ffffff";
  } 
  context.fillStyle = backgroundColor;

  if (isInitialBorderExist) {
    const gradient = context.createLinearGradient(
      initialRectPosition.x + panOffset.x,
      initialRectPosition.y + panOffset.y,
      initialRectPosition.x + panOffset.x + initialRectPosition.w,
      initialRectPosition.y + panOffset.y + initialRectPosition.h
    );
    gradient.addColorStop(0, "#9cc8fb");
    gradient.addColorStop(0.6, "#d35bff");
    context.strokeStyle = gradient;
    context.fillStyle = backgroundColor;
    context.lineWidth = 3;
    context.fillRect(
      initialRectPosition.x + panOffset.x,
      initialRectPosition.y + panOffset.y,
      initialRectPosition.w,
      initialRectPosition.h
    );
    context.strokeRect(
      initialRectPosition.x + panOffset.x,
      initialRectPosition.y + panOffset.y,
      initialRectPosition.w,
      initialRectPosition.h
    );
  }

  if (image !== null) {
    context.drawImage(
        image,
        initialRectPosition.x + panOffset.x,
        initialRectPosition.y + panOffset.y,
        initialRectPosition.w,
        initialRectPosition.h
      );
      callback();
  } else {
    callback();
  }
};

export const getShapesFromHistory = (
history: Array<{ action: number; value: any }>,
index: number,
) => {
    const uniqueShapesMap: { [key: string]: { action: number; value: any } } = {}
    for (let i = 0; i <=index; i++) {
        const { action, value: shape } = history[i]
        if (!uniqueShapesMap[shape.id]) {
        uniqueShapesMap[shape.id] = history[i]
        }

        if (action === HistoryAction.DELETE) {
        delete uniqueShapesMap[shape.id]
        }
    }
    const uniqueShapes = Object.values(uniqueShapesMap).map(({ value }) => value)
    return uniqueShapes
}

const IsShapeDeleted = (
  id: number,
  history: Array<{ action: number; value: any }>,
  index: number,
) => {
  console.log(history)
  for (let i = index; i >= 0; i--) {
    if (history[i].value.id === id && history[i].action === HistoryAction.DELETE) {
      return true
    }
  }
  return false
}
  
export const adjustHistoryToIndex  = (
canvas: HTMLCanvasElement,
context: CanvasRenderingContext2D,
initialRect: {
    x: number
    y: number
    w: number
    h: number
},
_history: any[],
index: number,
panOffset: { x: number; y: number },
isInitialBorderExist: boolean = true,
image: HTMLImageElement | null,
theme: string | undefined
) => {
context.clearRect(0, 0, canvas.width, canvas.height)
drawInitialRectangle(context, initialRect, panOffset, isInitialBorderExist, image, theme, () => {
  for (var i = 0; i <= index; i++) {
    var actionType = _history[i].action;
    if (_history[i].value == null) continue;
    let shape = _history[i].value;

    if (actionType === HistoryAction.DELETE && shape === "all") {
      context.clearRect(0, 0, canvas.width, canvas.height)
      drawInitialRectangle(context, initialRect, panOffset, isInitialBorderExist, image, theme, () => {})
      continue
    }

    if (IsShapeDeleted(shape.id, _history, index)) {
      continue
    }
    shape.draw(context, panOffset);
  }
})
}

export const setNewHistory = (
    currentHistoryIndex: number,
    setCurrentHistoryIndex: Dispatch<SetStateAction<number>>,
    _history: any[],
    setHistory: Dispatch<SetStateAction<any[]>>,
    currentShape: any,
    action: HistoryAction,
) => {
    if (action == HistoryAction.MOVE && _history[currentHistoryIndex].value.id == currentShape.id) {
        _history[currentHistoryIndex].value = currentShape
        return
    }
    if (currentHistoryIndex < _history.length - 1) {
        _history.splice(currentHistoryIndex + 1, _history.length - currentHistoryIndex - 1)
    }
    setCurrentHistoryIndex(currentHistoryIndex + 1)
    setHistory([
        ..._history,
        { action: action, value: currentShape },
    ])
}

export const redo = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    initialRectPosition: {
        x: number
        y: number
        w: number
        h: number
    },
    _history: any[],
    currentHistoryIndex: number,
    setCurrentHistoryIndex: Dispatch<SetStateAction<number>>,
    panOffset: { x: number; y: number },
    image: HTMLImageElement | null,
    theme: string | undefined
) => {
    if (currentHistoryIndex >= _history.length - 1) return
    setCurrentHistoryIndex(currentHistoryIndex + 1)
    adjustHistoryToIndex (
      canvas,
      context,
      initialRectPosition,
      _history,
      currentHistoryIndex + 1,
      panOffset,
      true,
      image,
      theme
    )
}

export const undo = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    initialRectPosition: {
        x: number
        y: number
        w: number
        h: number
    },
    _history: any[],
    currentHistoryIndex: number,
    setCurrentHistoryIndex: Dispatch<SetStateAction<number>>,
    panOffset: { x: number; y: number },
    image: HTMLImageElement | null,
    theme: string | undefined
) => {
    if (currentHistoryIndex < 0) return
    
    setCurrentHistoryIndex(currentHistoryIndex - 1)
    adjustHistoryToIndex (
      canvas,
      context,
      initialRectPosition,
      _history,
      currentHistoryIndex - 1,
      panOffset,
        true,
        image,
        theme
    )
}
