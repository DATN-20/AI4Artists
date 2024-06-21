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
import {
  selectGenerate,
  setField,
  setStyleField,
} from "@/features/generateSlice"
import { CanvasModeContext } from "@/store/canvasHooks"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useContext, useEffect, useState, useRef } from "react"
import { SaveChangesButton } from "../canvas/tools/SaveChangesButton"
import { useGetProfileAlbumQuery } from "@/services/profile/profileApi"
import { selectAuth, setTotalAlbum } from "@/features/authSlice"
import Image from "next/image"
import axios from "axios"
import { AlbumData, ImageAlbum } from "@/types/profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { base64StringToFile } from "@/lib/base64StringToFile"

const ControlnetDialog = ({
  type,
  isStyleGenerate,
  defaultValue,
}: {
  type: string
  isStyleGenerate?: boolean
  defaultValue?: string
}) => {
  const canvasModeContext = useContext(CanvasModeContext)
  const { imageFile } = canvasModeContext!
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(
    defaultValue ? base64StringToFile(defaultValue, "image.jpg") : null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: albumData, refetch: fullInfoRetch } = useGetProfileAlbumQuery()
  const authStates = useAppSelector(selectAuth)
  const [selectedAlbumImageIndex, setSelectedAlbumImageIndex] =
    useState<number>(-1)

  const base64ToFile = async (
    base64: string,
    filename: string,
  ): Promise<File> => {
    const response = await fetch(base64)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const imageGen = files[0]
      setSelectedImage(imageGen)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()
        if (base64String) {
          if (isStyleGenerate) {
            dispatch(
              setStyleField({
                field: type,
                value: base64String,
                ArrayIndex: 0,
              }),
            )
          } else {
            dispatch(setField({ field: type, value: base64String }))
          }
        }
      }
      reader.readAsDataURL(imageGen)
    }
  }

  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    setSelectedImage(file)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAlbumClick = (album: any) => {
    setSelectedAlbum(album)
  }

  const handleImageSelectFromAlbum = async (image: any, index: number) => {
    try {
      const response = await axios.get(image.url, {
        responseType: "blob",
      })
      const imageFile = new File([response.data], "image.jpg", {
        type: response.data.type,
      })
      setSelectedImage(imageFile)
      setSelectedAlbumImageIndex(index)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString()

        if (base64String) {
          if (isStyleGenerate) {
            dispatch(
              setStyleField({
                field: type,
                value: base64String,
                ArrayIndex: 0,
              }),
            )
          } else {
            dispatch(setField({ field: "image", value: base64String }))
          }
        }
      }
      reader.readAsDataURL(imageFile)
    } catch (error) {
      console.error("Error fetching the image file: ", error)
    }

    setOpen(false)
  }

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
      setSelectedImage(imageFile)
    }
  }, [imageFile])

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        {!selectedImage && (
          <DialogTrigger>
            <Button
              variant={"outline"}
              className="w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
            >
              Add Controlnet Image
            </Button>
          </DialogTrigger>
        )}
        <DialogContentLoginModal
          className="left-0 top-0 flex h-full max-w-none translate-x-0 translate-y-0 justify-center border-none p-0"
          style={{ borderRadius: 30 }}
        >
          <Canvas />
          <OptionSelect />
          <ToolSelect />
          <SaveChangesButton open={open} setOpen={setOpen} />
        </DialogContentLoginModal>
      </Dialog>
      {selectedImage && (
        <Image
          src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
          alt="Selected"
          className="w-full rounded-xl object-cover"
          width={512}
          height={512}
          onClick={() => setOpen(true)}
        />
      )}
    </div>
  )
}

export default ControlnetDialog
