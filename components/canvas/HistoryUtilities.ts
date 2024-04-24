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
  imageFile: File | null = null,
  callback?: () => void
) => {
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = context.canvas.width;
  offscreenCanvas.height = context.canvas.height;
  const offscreenContext = offscreenCanvas.getContext('2d');
  if (!offscreenContext) return;

  const render = () => {
    offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    offscreenContext.beginPath();
    offscreenContext.fillStyle = "transparent";
    
    if (isInitialBorderExist) {
      const gradient = offscreenContext.createLinearGradient(
        initialRectPosition.x + panOffset.x,
        initialRectPosition.y + panOffset.y,
        initialRectPosition.x + panOffset.x + initialRectPosition.w,
        initialRectPosition.y + panOffset.y + initialRectPosition.h
      );
      gradient.addColorStop(0, "#9cc8fb");
      gradient.addColorStop(0.6, "#d35bff");
      offscreenContext.strokeStyle = gradient;
      offscreenContext.lineWidth = 3;
      offscreenContext.strokeRect(
        initialRectPosition.x + panOffset.x,
        initialRectPosition.y + panOffset.y,
        initialRectPosition.w,
        initialRectPosition.h
      );
    }

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          offscreenContext.drawImage(
            image,
            initialRectPosition.x + panOffset.x,
            initialRectPosition.y + panOffset.y,
            initialRectPosition.w,
            initialRectPosition.h
          );
          context.drawImage(offscreenCanvas, 0, 0);
          if (callback) callback();
        };
        image.src = event.target?.result as string;
      };
      reader.readAsDataURL(imageFile);
    } else {
      offscreenContext.fillRect(
        initialRectPosition.x + panOffset.x,
        initialRectPosition.y + panOffset.y,
        initialRectPosition.w,
        initialRectPosition.h
      );
      context.drawImage(offscreenCanvas, 0, 0);
      if (callback) callback();
    }
  };

  requestAnimationFrame(render);
};


export const getShapesFromHistory = (
history: Array<{ action: number; value: any }>,
) => {
    const uniqueShapesMap: { [key: string]: { action: number; value: any } } = {}
    for (let i = history.length - 1; i >= 0; i--) {
        const { action, value: shape } = history[i]
        if (!uniqueShapesMap[shape.id] && action !== HistoryAction.DELETE) {
        uniqueShapesMap[shape.id] = history[i]
        }
    }
    const uniqueShapes = Object.values(uniqueShapesMap).map(({ value }) => value)
    return uniqueShapes
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
imageFile: File | null = null
) => {
context.clearRect(0, 0, canvas.width, canvas.height)
drawInitialRectangle(context, initialRect, panOffset, isInitialBorderExist, imageFile, () => {
  for (var i = 0; i <= index; i++) {
    var actionType = _history[i].action;
    if (_history[i].value == null) continue;

    switch (actionType) {
      case HistoryAction.CREATE:
      case HistoryAction.MOVE:
        _history[i].value.draw(context, panOffset);
        break;
      default:
        break;
    }
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
    imageFile: File | null = null
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
        imageFile
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
    imageFile: File | null = null
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
        imageFile
    )
}

