import React, { useState, useRef, useEffect } from "react"
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
import { Person, requestData } from "@/types/profile"
import { ErrorObject } from "@/types"

interface ProfileHeaderProps {
  userData: Person | undefined
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isHoveredBg, setIsHoveredBg] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    unit: "px", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  })
  const [croppedImageUrl, setCroppedImageUrl] = useState(userData?.avatar)
  const [croppedBgUrl, setCroppedBgUrl] = useState(userData?.background)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null,
  )
  const [originalBg, setOriginalBg] = useState<HTMLImageElement | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showBgModal, setShowBgModal] = useState(false)
  const [editProfileToggle, setEditProfileToggle] = useState(false)

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
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      alias_name: userData?.alias_name || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      description: userData?.description || "",
    }))
    setProfileData((prevData) => ({
      ...prevData,
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      alias_name: userData?.alias_name || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      description: userData?.description || "",
    }))
    userData?.socials?.forEach((item) => {
      switch (item.social_name) {
        case "Instagram":
          socialLinks.instagram = item.social_link
          setFormData((prevData) => ({
            ...prevData,
            instagram: item.social_link || "",
          }))
          break
        case "Facebook":
          socialLinks.facebook = item.social_link
          setFormData((prevData) => ({
            ...prevData,
            facebook: item.social_link || "",
          }))
          break
        case "Twitter":
          socialLinks.twitter = item.social_link
          setFormData((prevData) => ({
            ...prevData,
            twitter: item.social_link || "",
          }))
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
    setProfileData((prevData) => ({
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
          const resizedImage = resizeImage(image)
          setOriginalImage(resizedImage)
          toggleAvatarModal()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const resizeImage = (image: HTMLImageElement): HTMLImageElement => {
    const deviceWidth = window.innerWidth
    const deviceHeight = window.innerHeight

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    let width = image.width
    let height = image.height

    if (width > deviceWidth || height > deviceHeight) {
      if (width / deviceWidth > height / deviceHeight) {
        height *= ((deviceWidth / width) * 2) / 3
        width = (deviceWidth * 2) / 3
      } else {
        width *= ((deviceHeight / height) * 2) / 3
        height = (deviceHeight * 2) / 3
      }
    }

    canvas.width = width
    canvas.height = height

    ctx?.drawImage(image, 0, 0, width, height)

    const resizedImage = new Image()
    resizedImage.src = canvas.toDataURL("image/jpeg")
    return resizedImage
  }

  const handleBgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result as string
        image.onload = () => {
          const resizedImage = resizeImage(image)
          setOriginalBg(resizedImage)
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

        if (croppedImageBase64) {
          let formData = new FormData()

          const filename = "image.jpg"
          const imageFile = base64StringToFile(croppedImageBase64, filename)
          formData.append("file", imageFile)
          const result = await updateBackground(formData)
          if ((result as ErrorObject).error) {
            toast.error((result as ErrorObject).error.data.message)
          } else {
            setCroppedBgUrl(croppedImageBase64)
            toast.success("Update background successfully")
          }
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
        if (croppedImageBase64) {
          let formData = new FormData()

          const filename = "image.jpg"
          const imageFile = base64StringToFile(croppedImageBase64, filename)
          formData.append("file", imageFile)
          const result = await updateAvatar(formData)
          if ((result as ErrorObject).error) {
            toast.error((result as ErrorObject).error.data.message)
          } else {
            setCroppedImageUrl(croppedImageBase64)
            toast.success("Update avatar successfully")
          }
        }
      }
    }
  }
  const [formData, setFormData] = useState({
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    alias_name: userData?.alias_name || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    description: userData?.description || "",
    instagram: "",
    facebook: "",
    twitter: "",
  })
  const [profileData, setProfileData] = useState({
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    alias_name: userData?.alias_name || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    description: userData?.description || "",
    instagram: "",
    facebook: "",
    twitter: "",
  })
  const {
    first_name,
    last_name,
    alias_name,
    instagram,
    facebook,
    twitter,
    phone,
    address,
    description,
  } = formData

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async () => {
    const requestBody = {
      firstName: formData.first_name,
      aliasName: formData.alias_name,
      lastName: formData.last_name,
      phone: formData.phone,
      address: formData.address,
      description: formData.description,
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
      const result = await updateProfile(requestBody as requestData)
      // setGenerateImgData(result);
      if ((result as ErrorObject).error) {
        toast.error((result as ErrorObject).error.data.message)
      } else {
        toast.success("Update profile successfully")
        setProfileData({
          first_name: formData.first_name,
          last_name: formData.last_name,
          alias_name: formData.alias_name,
          phone: formData.phone,
          address: formData.address,
          description: formData.description,
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter,
        })
        setEditProfileToggle(false)
      }
    } catch (error) {
      console.error("Error:", error)
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
          <div className="absolute inset-0 flex h-[540px] items-center justify-center  bg-black bg-opacity-50">
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
          src={croppedImageUrl || "/default.jpg"}
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
      <Dialog open={showBgModal}>
        <AlertDialog>
          <DialogContent className="w-fit	max-w-4xl	">
            {originalBg && (
              <ReactCrop
                crop={crop}
                onChange={onBgCrop}
                // onComplete={getCroppedImage}
              >
                <img src={originalBg?.src} />
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
                    toggleBgModal()
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
                    <Button type="submit" onClick={handleSaveBg}>
                      Save
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </DialogFooter>
          </DialogContent>
        </AlertDialog>
      </Dialog>
      <Dialog open={showAvatarModal}>
        <AlertDialog>
          <DialogContent className="w-fit	max-w-4xl	">
            {originalImage && (
              <ReactCrop
                crop={crop}
                onChange={onImageCrop}
                circularCrop={true}
                aspect={1 / 1}
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
      <div className="ml-[240px] flex items-center justify-between px-2 pt-2">
        <div className="flex flex-col">
          <h1 className="flex text-3xl font-bold">
            {profileData?.first_name + " " + profileData?.last_name}{" "}
            {profileData?.alias_name.length > 0
              ? " (" + profileData?.alias_name + ")"
              : ""}
            <AlertDialog open={editProfileToggle}>
              <IoPencilSharp
                className="ml-3 cursor-pointer"
                onClick={() => {
                  setEditProfileToggle(true)
                }}
              ></IoPencilSharp>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Edit Profile
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={first_name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={last_name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="alias_name"
                      className="block text-sm font-medium"
                    >
                      Alias Name
                    </label>
                    <input
                      type="text"
                      id="alias_name"
                      name="alias_name"
                      value={alias_name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium"
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
                  <div>
                    <label
                      htmlFor="facebook"
                      className="block text-sm font-medium"
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
                  <div>
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium"
                    >
                      Twitter Link
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={twitter}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <AlertDialogFooter className="mt-5">
                    <AlertDialogCancel
                      onClick={() => {
                        setEditProfileToggle(false)
                      }}
                    >
                      Cancel
                    </AlertDialogCancel>
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
                              onClick={() => {
                                handleUpdateProfile()
                              }}
                            >
                              Yes
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </h1>
          <p
            className="text-lg font-light"
            dangerouslySetInnerHTML={{ __html: profileData?.description }}
          ></p>
        </div>
        {/* Social Links */}
        <div className="flex flex-col justify-end">
          <div className="mb-5 flex">
            {profileData?.instagram && (
              <a
                href={profileData.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={24} className="ml-4 cursor-pointer" />
              </a>
            )}
            {profileData?.facebook && (
              <a
                href={profileData.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={24} className="ml-4 cursor-pointer" />
              </a>
            )}
            {profileData?.twitter && (
              <a
                href={profileData.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={24} className="ml-4 cursor-pointer" />
              </a>
            )}
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
