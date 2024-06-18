import { Card, CardContent, CardHeader } from "@/components/ui/card"
import CardSection from "./card-section/CardSection"
import Image from "next/image"
import { IoPerson, IoPersonCircleSharp } from "react-icons/io5"
import { MdLogout, MdModelTraining } from "react-icons/md"
import { Palette } from "lucide-react"
import {
  FaClipboardCheck,
  FaTag,
  FaImages,
  FaHome,
  FaDiscord,
} from "react-icons/fa"
import { usePathname, useRouter } from "next/navigation"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { logout } from "@/features/authSlice"
import { toast } from "react-toastify"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import NextImage from "next/image"

const NavigationSideBarCard = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    dispatch(logout())
    router.push("/")
    toast.success("Logged out successfully")
  }

  const [currentSection, setCurrentSection] = useState("home")

  // Sử dụng JSON.parse một cách an toàn
  const getUserDataFromLocalStorage = () => {
    const data = localStorage.getItem("userData")
    return data ? JSON.parse(data) : null
  }

  const [userData, setUserData] = useState(getUserDataFromLocalStorage())

  useEffect(() => {
    const section = pathname.split("/")[1]
    setCurrentSection(section)
  }, [pathname])

  const pages = [
    {
      title: "Image Generation",
      href: "/generate",
      icon: <FaImages />,
    },
    {
      title: "Canvas",
      href: "/canvas",
      icon: <Palette />,
    },
    {
      title: "Upscale Image",
      href: "/upscale",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Remove Background",
      href: "/remove-bg",
      icon: <FaTag />,
    },
  ]
  const { theme } = useTheme()

  const [logoSrc, setLogoSrc] = useState<string>(
    theme === "dark" ? "/logo-white.png" : "/logo-black.png",
  )
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo-white.png" : "/logo-black.png")
  }, [theme])
  return (
    <>
      <Card className="flex h-full min-h-full flex-col">
        <CardHeader
          className="mt-4 flex cursor-pointer flex-col items-center gap-4"
          onClick={() => {
            router.push("/dashboard")
          }}
        >
          <NextImage alt="logo" width={180} height={180} src={logoSrc} />
          <span className="bg-gradient-default bg-clip-text text-5xl font-black text-transparent">
            AI4Artist
          </span>
        </CardHeader>
        <CardContent className="flex h-full flex-col justify-between gap-4 px-4 py-2">
          <ul className=" flex flex-col gap-4">
            {pages.map((page, index) => (
              <CardSection
                key={index}
                title={page.title}
                href={page.href}
                icon={page.icon}
                onClick={() => {}}
                classNames={`rounded-lg p-2 pl-3 font-semibold 
                  ${page.href === pathname ? "dark:bg-gray-800 bg-slate-300 text-primary-700" : "hover:bg-slate-300 dark:hover:bg-gray-800 hover:text-primary-700"}
                  `}
              />
            ))}
          </ul>
          <div className="border-dark flex flex-col gap-3 border-t-2 pt-2 dark:border-white">
            <div className="flex items-center justify-between gap-2">
              <div className="rounded-lg bg-card py-2 font-semibold">
                <a
                  className="flex items-center gap-2"
                  href={`/profile/${userData.id}`}
                >
                  {userData?.avatar ? (
                    <Image
                      src={userData.avatar}
                      width={40}
                      height={40}
                      alt="User Avatar"
                      className="rounded-full"
                    />
                  ) : (
                    <IoPersonCircleSharp size={40} />
                  )}
                  <span className="text-xl font-bold hover:text-primary-700">
                    {userData?.first_name + " " + userData?.last_name}
                  </span>
                </a>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <MdLogout
                    size={28}
                    className="cursor-pointer hover:text-primary-700"
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader className="mb-5">
                    <AlertDialogTitle>
                      Are you sure to log out?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-5">
                    <AlertDialogAction>
                      <button onClick={handleLogout}>Yes</button>
                    </AlertDialogAction>
                    <AlertDialogCancel>No</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-3 ">
                <Facebook size={24} />
                <Instagram size={24} />
                <Twitter size={24} />
                <FaDiscord size={24} />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default NavigationSideBarCard
