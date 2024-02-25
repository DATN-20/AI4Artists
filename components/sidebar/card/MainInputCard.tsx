import { Card, CardContent, CardHeader } from "../../ui/card"
import CardSection from "./card-section/CardSection"
import Image from "next/image"
import { Home } from "lucide-react"

const MainInputCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-6">
        <Image src="/logo.png" alt="logo" width={70} height={70} />
        <h1 className="text-4xl font-bold text-white">AIArtist</h1>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <ul className=" flex flex-col gap-3">
          <li>
            <CardSection title="Home" href="#" isOpen={true} icon={<Home />} />
          </li>
          <li>
            <CardSection
              title="Commmunity"
              href="#"
              isOpen={false}
              icon={<Home />}
            />
          </li>
          <li>
            <CardSection
              title="Personal Feed"
              href="#"
              isOpen={false}
              icon={<Home />}
            />
          </li>
          <li>
            <CardSection
              title="Trainning & Dataset"
              href="#"
              isOpen={false}
              icon={<Home />}
            />
          </li>
          <li>
            <CardSection
              title="Models"
              href="#"
              isOpen={false}
              icon={<Home />}
            />
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

export default MainInputCard
