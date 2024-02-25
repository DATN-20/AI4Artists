import { Card } from "antd"
import CardSection from "./card-section/CardSection"
import Image from "next/image"

const MainInputCard = () => {
  return (
    <Card className=" bg-black">
      <div className="flex items-center gap-4">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <h1 className="text-2xl font-bold text-white">AIArtist</h1>
      </div>
      <ul className="mt-6 flex flex-col gap-3">
        <li>
          <CardSection title="Home" href="#" isOpen={true} />
        </li>
        <li>
          <CardSection title="Commmunity" href="#" isOpen={false} />
        </li>
        <li>
          <CardSection title="Personal Feed" href="#" isOpen={false} />
        </li>
        <li>
          <CardSection title="Trainning & Dataset" href="#" isOpen={false} />
        </li>
        <li>
          <CardSection title="Models" href="#" isOpen={false} />
        </li>
      </ul>
    </Card>
  )
}

export default MainInputCard
