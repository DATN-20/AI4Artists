import { Home } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import CardSection from "./card-section/CardSection"
import { FaImages } from "react-icons/fa6"
import { Palette } from "lucide-react"
import { FaClipboardCheck } from "react-icons/fa"
import { FaTag } from "react-icons/fa"

const OtherInputCard = () => {
  return (
    <Card>
      <CardContent className="px-4 py-3">
        <ul className=" flex flex-col gap-3">
          <li>
            <CardSection
              onClick={() => {}}
              title="Image Generation"
              href="/generate"
              isOpen={true}
              icon={<FaImages />}
            />
          </li>
          <li>
            <CardSection
              onClick={() => {}}
              title="Realtime Canvas"
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
              title="Image Tag"
              href="#"
              isOpen={false}
              icon={<FaTag />}
            />
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

export default OtherInputCard
