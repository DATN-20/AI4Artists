import NavigationSideBar from "@/components/sidebar/NavigationSideBar"
import { Facebook, Home, Instagram, Twitter } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { CiViewList } from "react-icons/ci"
import { IoImages } from "react-icons/io5"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs"

const Profile = () => {
  return (
    <div className="flex gap-4 py-4 ">
      <div className="hidden lg:block lg:w-[300px]">
        <NavigationSideBar />
      </div>
      <div className="mr-8 h-full flex-grow">
        <div className="relative  flex flex-col">
          <div className="h-[164px] rounded-2xl bg-gray-500"></div>
          <div className=" absolute bottom-0 left-3 h-[128px] w-[128px] rounded-full bg-pink-400"></div>
          <div className="ml-[140px] flex items-center justify-between px-2 pt-2">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Username</h1>
              <p className="text-lg font-light">nickname</p>
            </div>
            <div className="flex gap-4">
              <Facebook size={24} />
              <Instagram size={24} />
              <Twitter size={24} />
              <FaDiscord size={24} />
            </div>
          </div>
        </div>
        <Tabs defaultValue="introduction">
          <TabsList className="flex justify-end gap-2 bg-inherit">
            <TabsTrigger value="introduction">
              <IoImages size={24} />
            </TabsTrigger>
            <TabsTrigger value="profile">
              <CiViewList size={26} />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="introduction">Introduction</TabsContent>
          <TabsContent value="profile">Profile here</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Profile
