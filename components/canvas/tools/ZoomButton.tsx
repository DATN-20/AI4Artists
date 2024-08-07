import { CanvasModeContext } from "@/store/canvasHooks"
import { useContext, useState, memo } from "react"
import { Button } from "@/components/ui/button"
import * as Slider from "@radix-ui/react-slider"
import { FiZoomIn } from "react-icons/fi"

export const ZoomButton: React.FC = memo(() => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { scale, setScale } = canvasModeContext!

  const [isSliderVisible, setIsSliderVisible] = useState(false)
  const toggleSlider = () => {
    setIsSliderVisible(!isSliderVisible)
  }

  return (
    <div className="relative">
      <div
        className="my-1 rounded-xl bg-card from-sky-300 to-primary-700 to-60% p-3 font-bold hover:bg-gradient-to-br dark:bg-white dark:text-black"
        onClick={toggleSlider}
      >
        <FiZoomIn size={25} />
      </div>
      {isSliderVisible && (
        <div className="absolute top-1/2 z-10 ms-[-220px] flex h-[25px] w-[200px] -translate-y-1/2 transform items-center rounded bg-stone-600">
          <Slider.Root
            className="relative flex h-5 w-full touch-none select-none items-center px-2"
            value={[scale]}
            min={0.25}
            max={3}
            step={0.25}
            aria-label="Volume"
            onValueChange={(e) => setScale(e[0])}
          >
            <Slider.Track className="relative h-3 grow rounded-xl bg-slate-200">
              <Slider.Range className="absolute h-3 rounded-xl bg-gradient-default-to-r" />
            </Slider.Track>
            <Slider.Thumb className="group relative block h-4 w-4 cursor-pointer rounded-full border-none bg-primary-600 outline-none duration-150 active:scale-125 ">
              <h1 className="absolute -translate-x-3 whitespace-nowrap rounded-xl bg-primary px-4 py-1 text-center text-xs font-bold text-white opacity-0 duration-150 ease-in-out group-active:-translate-y-8 group-active:opacity-100">
                {scale}
              </h1>
            </Slider.Thumb>
          </Slider.Root>
        </div>
      )}
    </div>
  )
})
