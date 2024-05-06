import React, { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectAuth } from "@/features/authSlice"
import { Facebook, Instagram } from "lucide-react"
import { IoCloudUploadOutline, IoImages } from "react-icons/io5"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { CiViewList } from "react-icons/ci"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useUpdateAvatarMutation } from "@/services/profile/profileApi"

interface ProfileHeaderProps {
  userData: {
    firstName: string
    lastName: string
    aliasName: string
    profileImageUrl: string
    socials: { social_name: string; social_link: string }[]
    avatar: string
  }
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
  const authStates = useSelector(selectAuth)
  const [isHovered, setIsHovered] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  })
  const [croppedImageUrl, setCroppedImageUrl] = useState(userData?.avatar)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null,
  )
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [updateAvatar] = useUpdateAvatarMutation()

  const toggleAvatarModal = () => {
    setShowAvatarModal(!showAvatarModal)
  }
  function base64StringToFile(base64String: string, filename: string): File {
    const byteString = atob(base64String.split(",")[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: "image/jpeg" })
    return new File([blob], filename)
  }
  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  useEffect(() => {
    setCroppedImageUrl(userData?.avatar)
  }, [userData])

  const handleSave = () => {
    // Lưu ảnh đã cắt
    getCroppedImage()
    // Đóng dialog
    toggleAvatarModal()
  }
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result as string
        image.onload = () => {
          setOriginalImage(image)
          toggleAvatarModal()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onImageCrop = (crop: Crop) => {
    setCrop(crop)
  }

  const getCroppedImage = async () => {
    if (originalImage) {
      const canvas = document.createElement("canvas")
      const scaleX = originalImage.width / (originalImage.naturalWidth || 1)
      const scaleY = originalImage.height / (originalImage.naturalHeight || 1)
      const ctx = canvas.getContext("2d")

      if (ctx && crop.width && crop.height) {
        canvas.width = crop.width
        canvas.height = crop.height

        ctx.drawImage(
          originalImage,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        )

        const croppedImageBase64 = canvas.toDataURL("image/jpeg")
        setCroppedImageUrl(croppedImageBase64)
        console.log(croppedImageBase64)
        if (croppedImageBase64) {
          let formData = new FormData()

          const filename = "image.jpg"
          const imageFile = base64StringToFile(croppedImageBase64, filename)
          formData.append("file", imageFile)
          await updateAvatar(formData)
          toast.success("Update avatar successfully")
        }
      }
    }
  }

  return (
    <div className="relative mb-4 flex flex-col">
      <div className="h-[540px] rounded-2xl bg-gray-500 bg-[url('https://e1.pxfuel.com/desktop-wallpaper/574/129/desktop-wallpaper-1-horizontal-backgrounds-aesthetic-vibe-horizontal.jpg')] bg-cover"></div>
      <div
        className="absolute bottom-0 left-3 h-[220px] w-[220px] rounded-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          className="h-full w-full rounded-full object-cover"
          src={croppedImageUrl || "default.jpg"}
          alt=""
        />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
            <label htmlFor="avatarInput" className="cursor-pointer">
              <IoCloudUploadOutline size={36} className="text-white" />

              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        )}
      </div>
      <Dialog open={showAvatarModal}>
        <DialogContent>
          {originalImage && (
            <ReactCrop
              crop={crop}
              onChange={onImageCrop}
              // onComplete={getCroppedImage}
            >
              <img src={originalImage?.src} />
            </ReactCrop>
          )}

          <DialogFooter className="mt-4 flex justify-between">
            <Button
              type="submit"
              className="rounded-md  px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
              onClick={handleSave}
            >
              Save changes
            </Button>
            <DialogClose>
              <Button
                type="button"
                className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none"
                onClick={() => {
                  toggleAvatarModal()
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="ml-[240px] flex items-center justify-between px-2 pt-2">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">
            {userData?.firstName + " " + userData?.lastName}
          </h1>
          <p className="text-lg font-light">{userData?.aliasName}</p>
        </div>
        {/* Social Links */}
        <div className="flex flex-col justify-end">
          <div className="mb-5 flex">
            {userData?.socials.map((item, index) => (
              <a
                key={index}
                href={item.social_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Render Social Icon */}
                {item.social_name === "facebook" && (
                  <Facebook size={24} className="ml-4 cursor-pointer" />
                )}
                {item.social_name === "instagram" && (
                  <Instagram size={24} className="ml-4 cursor-pointer" />
                )}
              </a>
            ))}
          </div>
          <TabsList className="flex justify-end gap-2 bg-inherit">
            <TabsTrigger value="introduction" className="px-0 py-0">
              <IoImages size={24} />
            </TabsTrigger>
            <TabsTrigger value="profile" className="ml-3 px-0 py-0">
              <CiViewList size={26} />
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
