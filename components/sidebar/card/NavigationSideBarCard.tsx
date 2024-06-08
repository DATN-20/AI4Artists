import { Card, CardContent, CardHeader } from "@/components/ui/card"
import CardSection from "./card-section/CardSection"
import Image from "next/image"
import { IoPerson, IoPersonCircleSharp } from "react-icons/io5"
import { MdLogout, MdModelTraining } from "react-icons/md"
import { TbBoxModel2 } from "react-icons/tb"
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

  const handleToggleSection = (section: string) => {
    setCurrentSection(section)
  }

  return (
    <>
      <Card>
        <CardHeader
          className="flex cursor-pointer flex-row items-center gap-4"
          onClick={() => {
            router.push("/dashboard")
          }}
        >
          <Image src="/logo.png" alt="logo" width={70} height={70} />
          <h1 className="text-4xl font-bold ">AIArtist</h1>
        </CardHeader>
        <CardContent className="px-4 pb-2">
          <ul className=" flex flex-col gap-3">
            <li>
              <CardSection
                onClick={() => {
                  handleToggleSection("home")
                  localStorage.removeItem("guestID")
                }}
                title="Home"
                href="/dashboard"
                isOpen={currentSection === "home"}
                icon={<FaHome />}
              />
            </li>
            <li>
              <CardSection
                onClick={() => {
                  handleToggleSection("profile")
                  localStorage.removeItem("guestID")
                }}
                title="Personal Feed"
                href={`/profile/${userData.id}`}
                isOpen={currentSection === "profile"}
                icon={<IoPerson />}
              />
            </li>
            <li>
              <CardSection
                onClick={() => handleToggleSection("#")}
                title="Training & Dataset"
                href="#"
                isOpen={currentSection === "#"}
                icon={<MdModelTraining />}
              />
            </li>
            <li>
              <CardSection
                onClick={() => handleToggleSection("#")}
                title="Models"
                href="#"
                isOpen={currentSection === "#"}
                icon={<TbBoxModel2 />}
              />
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="px-4 py-3">
          <ul className=" flex flex-col gap-3">
            <li>
              <CardSection
                onClick={() => {}}
                title="Image Generation"
                href="/generate"
                isOpen={false}
                icon={<FaImages />}
              />
            </li>
            <li>
              <CardSection
                onClick={() => {}}
                title="Canvas"
                href="/canvas"
                isOpen={false}
                icon={<Palette />}
              />
            </li>
            <li>
              <CardSection
                onClick={() => {}}
                title="Image Copyright"
                href="#"
                isOpen={false}
                icon={<FaClipboardCheck />}
              />
            </li>
            <li>
              <CardSection
                onClick={() => {}}
                title="Remove Background"
                href="/"
                isOpen={false}
                icon={<FaTag />}
              />
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="rounded-lg bg-card py-2 font-semibold">
              <a className="flex items-center gap-2">
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
                <span className="text-xl font-bold">
                  {userData?.first_name + " " + userData?.last_name}
                </span>
              </a>
            </div>
            <MdLogout
              onClick={handleLogout}
              size={28}
              className="cursor-pointer"
            />
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
      </Card>
    </>
  )
}

export default NavigationSideBarCard
