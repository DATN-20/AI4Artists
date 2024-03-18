import { useCanvasState } from "@/store/canvasHooks"
import { Button } from "@/components/ui/button"
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri"

const ZoomTool = () => {
  const { setIsZooming, setMagnifierZoom, magnifierZoom } = useCanvasState()
  const handleMagnifierClick = (action: string) => {
    setIsZooming(true)
    if (action === "zoomIn") {
      setMagnifierZoom(magnifierZoom + 0.1)
    } else if (action === "zoomOut") {
      setMagnifierZoom(Math.max(magnifierZoom - 0.1, 0.1))
    }
  }

  return (
    <div>
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
