import { useState, useRef } from "react"

const ImageInput: React.FC<{ onImageChange: (image: File) => void }> = ({
  onImageChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const image = files[0]
      setSelectedImage(image)
      onImageChange(image)
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
      className="mb-10 ml-10 mr-10 mt-10 max-w-[1020px] cursor-pointer border-2 border-dashed border-black p-20 text-center dark:border-white"
    >
      {selectedImage ? (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="mx-auto max-h-[512px] max-w-[512px]"
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
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </div>
  )
}

export default ImageInput
