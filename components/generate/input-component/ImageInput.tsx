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
      style={{
        border: "2px dashed #aaa",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        maxWidth: 800,
        width: "fit-content",
        marginTop: 20,
      }}
    >
      {selectedImage ? (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          style={{ maxWidth: "100%", maxHeight: "200px" }}
        />
      ) : (
        <p>Drag & drop an image here or click to select one</p>
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
