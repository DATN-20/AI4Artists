import React, { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectAuth } from "@/features/authSlice"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { IoCloudUploadOutline, IoImages, IoPencilSharp } from "react-icons/io5"
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
import {
  useUpdateAvatarMutation,
  useUpdateBackgroundMutation,
  useUpdateProfileMutation,
} from "@/services/profile/profileApi"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProfileHeaderGuestProps {
  userData: {
    first_name: string
    last_name: string
    alias_name: string
    profileImageUrl: string
    socials: { social_name: string; social_link: string }[]
    avatar: string
    background: string
  }
}

const ProfileHeaderGuest: React.FC<ProfileHeaderGuestProps> = ({
  userData,
}) => {
  const authStates = useSelector(selectAuth)
  const [isHovered, setIsHovered] = useState(false)
  const [isHoveredBg, setIsHoveredBg] = useState(false)
  const [openBgChange, setOpenBgChange] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  })
  const [croppedImageUrl, setCroppedImageUrl] = useState(userData?.avatar)
  const [croppedBgUrl, setCroppedBgUrl] = useState(userData?.background)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null,
  )
  const [originalBg, setOriginalBg] = useState<HTMLImageElement | null>(null)
  const [bgUrl, setBgUrl] = useState<string | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showBgModal, setShowBgModal] = useState(false)

  const [updateAvatar] = useUpdateAvatarMutation()
  const [updateBackground] = useUpdateBackgroundMutation()
  const [updateProfile] = useUpdateProfileMutation()
  const toggleAvatarModal = () => {
    setShowAvatarModal(!showAvatarModal)
  }
  const toggleBgModal = () => {
    setShowBgModal(!showBgModal)
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

  const handleMouseEnterBg = () => {
    setIsHoveredBg(true)
  }

  const handleMouseLeaveBg = () => {
    setIsHoveredBg(false)
  }

  useEffect(() => {
    setCroppedImageUrl(userData?.avatar)

    setCroppedBgUrl(userData?.background)
    const socialLinks = {
      instagram: "",
      facebook: "",
      twitter: "",
    }
    setFormData((prevData) => ({
      ...prevData,
      firstName: userData?.first_name || "",
      lastName: userData?.last_name || "",
      aliasName: userData?.alias_name || "",
    }))
    userData?.socials?.forEach((item) => {
      switch (item.social_name) {
        case "instagram":
          socialLinks.instagram = item.social_link
          break
        case "facebook":
          socialLinks.facebook = item.social_link
          break
        case "twitter":
          socialLinks.twitter = item.social_link
          break
        default:
          break
      }
    })

    // Cập nhật state formData với các link từ socials
    setFormData((prevData) => ({
      ...prevData,
      ...socialLinks,
    }))
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

  const handleBgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result as string
        image.onload = () => {
          setOriginalBg(image)
          toggleBgModal()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveBg = async () => {
    // Lưu ảnh đã cắt
    getCroppedBg()
    // Đóng dialog
    toggleBgModal()
  }

  const onImageCrop = (crop: Crop) => {
    setCrop(crop)
  }
  const onBgCrop = (crop: Crop) => {
    setCrop(crop)
  }
  const getCroppedBg = async () => {
    if (originalBg) {
      const canvas = document.createElement("canvas")
      const scaleX = originalBg.width / (originalBg.naturalWidth || 1)
      const scaleY = originalBg.height / (originalBg.naturalHeight || 1)
      const ctx = canvas.getContext("2d")

      if (ctx && crop.width && crop.height) {
        canvas.width = crop.width
        canvas.height = crop.height

        ctx.drawImage(
          originalBg,
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
        setCroppedBgUrl(croppedImageBase64)
        if (croppedImageBase64) {
          let formData = new FormData()

          const filename = "image.jpg"
          const imageFile = base64StringToFile(croppedImageBase64, filename)
          formData.append("file", imageFile)
          await updateBackground(formData)
          toast.success("Update background successfully")
        }
      }
    }
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
  const [formData, setFormData] = useState({
    firstName: userData?.first_name || "",
    lastName: userData?.last_name || "",
    aliasName: userData?.alias_name || "",
    instagram: "",
    facebook: "",
    twitter: "",
  })

  const { firstName, lastName, aliasName, instagram, facebook, twitter } =
    formData

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async () => {
    const requestBody = {
      firstName: formData.firstName,
      aliasName: formData.aliasName,
      lastName: formData.lastName,
      socials: [
        {
          socialName: "Facebook",
          socialLink: formData.facebook,
        },
        {
          socialName: "Twitter",
          socialLink: formData.twitter,
        },
        {
          socialName: "Instagram",
          socialLink: formData.instagram,
        },
      ],
    }

    try {
      const result = await updateProfile(requestBody).unwrap()
      // setGenerateImgData(result)
    } catch (error) {
      console.error("Error :", error)
    }
  }

  return (
    <div className="relative mb-4 flex flex-col">
      <div
        className="h-[540px] rounded-2xl bg-gray-500 "
        onMouseEnter={handleMouseEnterBg}
        onMouseLeave={handleMouseLeaveBg}
      >
        {/* backgrounds */}
        <img
          className="h-full w-full object-cover"
          src={
            croppedBgUrl ||
            "https://e1.pxfuel.com/desktop-wallpaper/574/129/desktop-wallpaper-1-horizontal-backgrounds-aesthetic-vibe-horizontal.jpg"
          }
          alt=""
        />
      </div>
      <div className="absolute bottom-0 left-3 h-[220px] w-[220px] rounded-full">
        <img
          className="h-full w-full rounded-full object-cover"
          src={croppedImageUrl || "default.jpg"}
          alt=""
        />
      </div>

      <div className="ml-[240px] flex items-center justify-between px-2 pt-2">
        <div className="flex flex-col">
          <h1 className="flex text-3xl font-bold">
            {userData?.first_name + " " + userData?.last_name}
          </h1>
          <p className="text-lg font-light">{userData?.alias_name}</p>
        </div>
        {/* Social Links */}
        <div className="flex flex-col justify-end">
          <div className="mb-5 flex">
            {userData?.socials?.map((item, index) => (
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
                {item.social_name === "twitter" && (
                  <Twitter size={24} className="ml-4 cursor-pointer" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeaderGuest
