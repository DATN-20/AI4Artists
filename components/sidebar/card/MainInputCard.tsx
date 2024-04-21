import { Card, CardContent, CardHeader } from "../../ui/card"
import CardSection from "./card-section/CardSection"
import Image from "next/image"
import { Home } from "lucide-react"
import { IoIosPeople } from "react-icons/io"
import { FaHome } from "react-icons/fa"
import { BsPeopleFill } from "react-icons/bs"
import { IoPerson } from "react-icons/io5"
import { MdModelTraining } from "react-icons/md"
import { TbBoxModel2 } from "react-icons/tb"

const MainInputCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Image src="/logo.png" alt="logo" width={70} height={70} />
        <h1 className="text-4xl font-bold ">AIArtist</h1>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <ul className=" flex flex-col gap-3">
          <li>
            <CardSection
              onClick={() => {}}
              title="Home"
              href="/dashboard"
              isOpen={true}
              icon={<FaHome />}
            />
          </li>
          <li>
            <CardSection
              onClick={() => {}}
              title="Community"
              href="#"
              isOpen={false}
              icon={<BsPeopleFill />}
            />
          </li>
          <li>
            <CardSection
              onClick={() => {}}
              title="Personal Feed"
              href="/profile"
              isOpen={false}
              icon={<IoPerson />}
            />
          </li>
          <li>
            <CardSection
              onClick={() => {}}
              title="Training & Dataset"
              href="#"
              isOpen={false}
              icon={<MdModelTraining />}
            />
          </li>
          <li>
            <CardSection
              onClick={() => {}}
              title="Models"
              href="#"
              isOpen={false}
              icon={<TbBoxModel2 />}
            />
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

export default MainInputCard
