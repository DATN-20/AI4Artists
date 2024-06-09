import Image from "next/image"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContentLoginModal,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"
import { AlbumWithImages, ImageAlbum } from "../../types/profile"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { selectAuth, setTotalAlbum } from "../../features/authSlice"
import { useGetProfileAlbumMutation } from "../../services/profile/profileApi"
import {
  useProcessImageMutation,
  useProcessLocalImageMutation,
} from "../../services/image/imageApi"
import { ProcessType } from "../../types/Image"
import { toast } from "react-toastify"
import Loading from "../Loading"
import { X } from "lucide-react"

const RemoveBackgroundProcessing = () => {
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/drag-white.png" : "/drag-black.png",
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithImages | null>(
    null,
  )
  const [selectedAlbumImageIndex, setSelectedAlbumImageIndex] =
    useState<number>(-1)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const authStates = useAppSelector(selectAuth)
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const [
    processLocalImage,
    {
      data: processedLocalData,
      isLoading: isLoadingLocal,
      isError: isErrorLocal,
    },
  ] = useProcessLocalImageMutation()

  const [processImage, { data: processedData, isLoading, isError }] =
    useProcessImageMutation()

  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/drag-white.png" : "/drag-black.png")
  }, [theme])

  const handleLocalImageProcess = async ({ file }: { file: File }) => {
    if (!file) return
    try {
      await processLocalImage({
        processType: ProcessType.REMOVE_BACKGROUND,
        image: file,
      })
    } catch (error) {
      console.log(error)
      toast.error("Error processing image")
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    // setSelectedImage(file)
    await handleLocalImageProcess({ file: file })
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    // setSelectedImage(file)
    await handleLocalImageProcess({ file: file })
  }

  const handleAlbumClick = (album: AlbumWithImages) => {
    setSelectedAlbum(album)
  }

  useEffect(() => {
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }
    fetchAlbumData()
  }, [])

  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])

  useEffect(() => {
    if (processedLocalData || processedData) {
      setResultImage(
        processedLocalData || processedData?.remove_background,
      )
    }
  }, [processedLocalData, processedData])

  const handleImageSelectFromAlbum = async (
    image: ImageAlbum,
    imageIndex: number,
  ) => {
    setSelectedAlbumImageIndex(imageIndex)
    if (!image.id) return

    if (image.remove_background) {
      setResultImage(image.remove_background)
      return
    }

    try {
      await processImage({
        processType: ProcessType.REMOVE_BACKGROUND,
        imageId: image.id,
      })
    } catch (error) {
      console.log(error)
      toast.error("Error processing image")
    }
  }

  async function saveImageToDisk(imageUrl: string) {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      // Get the extension from the image URL
      const urlParts = imageUrl.split(".")
      const extension = urlParts[urlParts.length - 1].split("?")[0]

      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `image.${extension}`
      document.body.appendChild(link)

      link.click()

      URL.revokeObjectURL(blobUrl)

      document.body.removeChild(link)

      toast.success("Image downloaded successfully!")
    } catch (error) {
      toast.error("Error downloading image: " + error)
    }
  }

  const handleDownloadImage = () => {
    if (resultImage) {
      saveImageToDisk(resultImage)
    }
  }

  //handle Error
  useEffect(() => {
    if (isErrorLocal || isError) {
      toast.error("Error processing image")
    }
  }, [isErrorLocal, isError])

  return (
    <div className="flex h-full w-full flex-col items-center gap-12">
      <div className="mt-8 flex flex-col items-center justify-center gap-4">
        <span className="bg-gradient-default bg-clip-text text-5xl font-black leading-[72px] text-transparent">
          Remove Image Background
        </span>
        <h3 className="text-3xl font-semibold">100% Automatically and Free</h3>
      </div>
      {isLoadingLocal || isLoading ? (
        <Loading />
      ) : resultImage ? (
        <div className="flex flex-col items-center justify-center gap-8 caret-transparent">
          <div className="relative h-full w-full">
            <img
              src={resultImage}
              alt="processed"
              className="h-auto w-full rounded-2xl"
            />
            <X
              className="absolute right-2 top-2 cursor-pointer"
              onClick={() => setResultImage(null)}
            />
          </div>
          <Button
            className="rounded-2xl bg-primary-500 px-6 py-7 text-xl font-semibold hover:bg-primary-600"
            onClick={handleDownloadImage}
          >
            Download
          </Button>
        </div>
      ) : (
        <Card
          className="relative flex h-[400px] w-[400px] flex-col items-center justify-center rounded-2xl caret-transparent"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Image
            src={logoSrc}
            width={150}
            height={150}
            alt="drag"
            className="absolute -right-32 top-3 z-10"
          />
          <Button
            className="rounded-2xl px-6 py-7 text-xl font-semibold"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click()
              }
            }}
          >
            Upload a File
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
            placeholder="Upload an image"
          />
          <h3 className="py-3 text-lg">Or</h3>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button
                className="rounded-2xl px-6 py-7 text-lg font-semibold"
                variant={"outline"}
              >
                Choose From Your Gallery
              </Button>
            </DialogTrigger>
            <DialogContentLoginModal
              className="flex h-[80vh] max-h-[80vh] w-[80vw] min-w-[80vw] flex-col border-none p-0"
              style={{ borderRadius: 30 }}
            >
              <DialogHeader className="mt-12 flex w-full items-center space-y-0">
                <h2 className="text-2xl font-semibold">
                  Select From Your Album
                </h2>
              </DialogHeader>
              <div className="p-4">
                {selectedAlbum ? (
                  <>
                    <div className="mt-3 grid h-[300px] grid-cols-4 gap-4 p-1">
                      {selectedAlbum.images &&
                        selectedAlbum.images.map(
                          (image: ImageAlbum, imageIndex: number) => (
                            <div
                              key={imageIndex}
                              className="relative h-40 cursor-pointer transition-opacity duration-300 hover:opacity-50"
                              onClick={() =>
                                handleImageSelectFromAlbum(image, imageIndex)
                              }
                            >
                              <Image
                                src={image.url}
                                alt={`Image ${imageIndex + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className={`rounded-md ${selectedAlbumImageIndex === imageIndex ? "border-2 border-primary-500 opacity-50" : ""}`}
                              />
                            </div>
                          ),
                        )}
                    </div>
                    <Button
                      variant={"outline"}
                      className=" flex w-fit rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
                      onClick={() => setSelectedAlbum(null)}
                    >
                      Back
                    </Button>
                  </>
                ) : (
                  <div className="mt-3 grid h-[300px] grid-cols-4 gap-4 p-1">
                    {authStates?.totalAlbum?.map(
                      (album: AlbumWithImages, index: number) => (
                        <div
                          key={index}
                          className={`relative grid h-full w-full gap-1 ${
                            album.images && album.images.length === 0
                              ? "grid-cols-1 grid-rows-1"
                              : "grid-cols-2 grid-rows-2"
                          }`}
                          onClick={() => handleAlbumClick(album)}
                        >
                          {album.images &&
                            album.images.length > 0 &&
                            album.images
                              .slice(0, 4)
                              .map((image: ImageAlbum, imageIndex: number) => (
                                <div key={imageIndex} className="relative h-40">
                                  <Image
                                    src={image.url}
                                    alt={`Image ${imageIndex + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                  />
                                </div>
                              ))}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <p className="text-center text-white">
                              Album: {album.album.name}
                            </p>
                          </div>
                          {album.images && album.images.length === 0 && (
                            <div className="mt-20 flex max-h-full max-w-full justify-center">
                              No images available
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </DialogContentLoginModal>
          </Dialog>
        </Card>
      )}
    </div>
  )
}

export default RemoveBackgroundProcessing
