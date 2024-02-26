import NavigationCard from "./card/MainInputCard"
import OtherInputCard from "./card/OtherInputCard"
import { Card } from "../ui/card"
import CardSection from "./card/card-section/CardSection"
import { Facebook, Home, Instagram, Twitter } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { ThemeToggle } from "../ThemeToggle"

export default function NavigationSideBar() {
  return (
    <div className="flex flex-col gap-4">
      <NavigationCard />
      <OtherInputCard />
      <Card>
        <div className="flex flex-col gap-3 px-4 py-3">
          <CardSection title="Log out" href="#" isOpen={true} icon={<Home />} />
          <CardSection
            title="username"
            href="#"
            isOpen={false}
            icon={<Home />}
          />
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
    </div>
  )
}