import { useAppDispatch } from "@/store/hooks"
import clsx from "clsx"
import { useState, useRef } from "react"
import { useSelector } from "react-redux"
const ImageInputStyle: React.FC<{
  onImageChange: (image: File) => void
  selectedImage: File | null
  setSelectedImage: (image: File) => void
}> = ({ onImageChange, selectedImage, setSelectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const imageGen = files[0]
      setSelectedImage(imageGen)
      onImageChange(imageGen)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    setSelectedImage(file)
    onImageChange(file)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={clsx("m-5 max-w-[1020px] cursor-pointer text-center", {
        "border-2 border-dashed border-black p-20 dark:border-white":
          !selectedImage,
      })}
    >
      {selectedImage ? (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="mx-auto max-h-[512px] max-w-[512px] rounded-lg"
        />
      ) : (
        <p className="dark:text-white">
          Drag & drop an image here or click to select one
        </p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        ref={fileInputRef}
        placeholder="Upload an image"
      />
    </div>
  )
}

export default ImageInputStyle
