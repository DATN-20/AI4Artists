import CardSection from "./card-section/CardSection"
import { Card } from "antd"

const OtherInputCard = () => {
  return (
    <Card className=" bg-black">
      <ul className="flex flex-col gap-4">
        <li>
          <CardSection title="Image Generation" href="#" isOpen={true} />
        </li>
        <li>
          <CardSection title="Realtime Canvas" href="#" isOpen={false} />
        </li>
        <li>
          <CardSection title="Image Copyright" href="#" isOpen={false} />
        </li>
        <li>
          <CardSection title="Image Tag" href="#" isOpen={false} />
        </li>
      </ul>
    </Card>
  )
}

export default OtherInputCard
