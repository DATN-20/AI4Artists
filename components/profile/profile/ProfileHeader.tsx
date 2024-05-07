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

interface ProfileHeaderProps {
  userData: {
    firstName: string
    lastName: string
    aliasName: string
    profileImageUrl: string
    socials: { social_name: string; social_link: string }[]
    avatar: string
    background: string
  }
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
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
  const [bgUrl, setBgUrl] = useState<string | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [updateAvatar] = useUpdateAvatarMutation()
  const [updateBackground] = useUpdateBackgroundMutation()
  const [updateProfile] = useUpdateProfileMutation()
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
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      aliasName: userData?.aliasName || "",
    }))
    userData?.socials.forEach((item) => {
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
        const imageUrl = reader.result as string
        setBgUrl(imageUrl)
        setOpenBgChange(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveBg = async () => {
    if (bgUrl) {
      const response = await fetch(bgUrl)
      const blob = await response.blob()

      const file = new File([blob], "background_image.jpg", {
        type: "image/jpeg",
      })
      let formData = new FormData()

      formData.append("file", file)

      toast.success("Update background successfully")
      setCroppedBgUrl(bgUrl)
      setOpenBgChange(false)
      await updateBackground(formData)
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
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    aliasName: userData?.aliasName || "",
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
      console.log(result)
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
        {isHoveredBg && (
          <div className="absolute inset-0 flex items-center justify-center  bg-black bg-opacity-50">
            <label htmlFor="avatarInput" className="cursor-pointer">
              <IoCloudUploadOutline size={36} className="text-white" />

              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                onChange={handleBgChange}
              />
            </label>
          </div>
        )}
      </div>
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
        <AlertDialog>
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
              <AlertDialogTrigger asChild>
                <Button
                  type="submit"
                  className="rounded-md  px-4 py-2 text-white  focus:outline-none"
                >
                  Save changes
                </Button>
              </AlertDialogTrigger>
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
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Are you sure you want to save changes?
                </AlertDialogDescription>
                <AlertDialogFooter className="mt-5">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                    <Button type="submit" onClick={handleSave}>
                      Save
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </DialogFooter>
          </DialogContent>
        </AlertDialog>
      </Dialog>
      <AlertDialog open={openBgChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to save changes?
          </AlertDialogDescription>
          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <Button type="submit" onClick={handleSaveBg}>
                Save
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="ml-[240px] flex items-center justify-between px-2 pt-2">
        <div className="flex flex-col">
          <h1 className="flex text-3xl font-bold">
            {userData?.firstName + " " + userData?.lastName}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <IoPencilSharp className="ml-3 cursor-pointer"></IoPencilSharp>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Edit Profile
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-300"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="aliasName"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Alias Name
                    </label>
                    <input
                      type="text"
                      id="aliasName"
                      name="aliasName"
                      value={aliasName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Instagram Link
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={instagram}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="facebook"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Facebook Link
                    </label>
                    <input
                      type="text"
                      id="facebook"
                      name="facebook"
                      value={facebook}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Twitter Link
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={twitter}
                      onChange={handleChange}
                      className="bg-gray mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <AlertDialogFooter className="mt-5">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button>Save</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            Are you sure you want to save changes?
                          </AlertDialogDescription>
                          <AlertDialogFooter className="mt-5">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                              <Button
                                type="submit"
                                onClick={handleUpdateProfile}
                              >
                                Yes
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </AlertDialogFooter>
                  </div>
                </form>
              </AlertDialogContent>
            </AlertDialog>
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
                {item.social_name === "twitter" && (
                  <Twitter size={24} className="ml-4 cursor-pointer" />
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
