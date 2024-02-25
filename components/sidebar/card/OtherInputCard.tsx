import { Home } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import CardSection from "./card-section/CardSection"

const OtherInputCard = () => {
  return (
    <Card>
      <CardContent className="px-4 py-3">
        <ul className=" flex flex-col gap-3">
          <li>
            <CardSection
              title="Image Generation"
              href="#"
              isOpen={true}
              icon={<Home />}
            />
          </li>
          <li>
            <CardSection
              title="Realtime Canvas"
              href="#"
              isOpen={false}
              icon={<Home />}
            />
          </li>
          <li>
            <CardSection
              title="Image Copyright"
              href="#"
              isOpen={false}
              icon={<Home />}
            />
          </li>
          <li>
            <CardSection
              title="Image Tag"
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

export default OtherInputCard
