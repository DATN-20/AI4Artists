import { CanvasModeContext } from "@/store/canvasHooks"
import { Button } from "@/components/ui/button"
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri"
import { useContext } from "react"
import { CanvasState } from "@/constants/canvas"

const ZoomTool = () => {
  const canvasContext = useContext(CanvasModeContext)
  const { setMagnifierZoom, setState, magnifierZoom } = canvasContext!
  const handleMagnifierClick = (action: string) => {
    setState(CanvasState.ZOOMING)
    if (action === "zoomIn") {
      setMagnifierZoom(magnifierZoom + 0.1)
    } else if (action === "zoomOut") {
      setMagnifierZoom(Math.max(magnifierZoom - 0.1, 0.1))
    }
  }

  return (
    <div className="z-10">
      <Button
        className="rounded-xl bg-card font-bold"
        onClick={() => handleMagnifierClick("zoomIn")}
      >
        <RiZoomInLine />
      </Button>
      <Button
        className="mx-4 rounded-xl bg-card font-bold "
        onClick={() => handleMagnifierClick("zoomOut")}
      >
        <RiZoomOutLine />
      </Button>
    </div>
  )
}

export default ZoomTool
