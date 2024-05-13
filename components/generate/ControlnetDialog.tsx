"use client"
import Canvas from "../canvas/Canvas"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContentLoginModal,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"
import OptionSelect from "../canvas/OptionSelect"
import ToolSelect from "../canvas/ToolSelect"
import { selectGenerate, setField } from "@/features/generateSlice"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useAppDispatch } from "@/store/hooks"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { SaveChangesButton } from "../canvas/tools/SaveChangesButton"
export const ControlnetDialog = ({ type }: { type: string }) => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { imageFile } = canvasModeContext!
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()
        if (base64String) {
          dispatch(setField({ field: "controlNetImages", value: base64String }))
        }
      }
      reader.readAsDataURL(imageFile)
    }
  }, [imageFile])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogHeader className="hidden" />
      <DialogTrigger>
        <Button
          variant={"outline"}
          className="ml-[16px] w-fit  rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
        >
          Add Pose Image
        </Button>
      </DialogTrigger>
      <DialogContentLoginModal className="left-0 top-0 flex h-full max-w-none translate-x-0 translate-y-0 justify-center border-none p-0">
        <Canvas />
        <div className="flex w-full lg:p-2">
          <div className="ml-20 mr-16 w-10/12">
            <div className="flex h-[650px] w-[1000px] items-center justify-center"></div>
            <OptionSelect />
          </div>

          <div className="z-10  flex h-full w-1/12 flex-col items-center justify-center gap-12">
            <div className="rounded-lg bg-card px-4 dark:bg-white">
              <ToolSelect />
            </div>
            <SaveChangesButton open={open} setOpen={setOpen} />
          </div>
        </div>
      </DialogContentLoginModal>
    </Dialog>
  )
}
