import NavigationCard from "./card/MainInputCard"
import { Row, Col } from "antd"
import OtherInputCard from "./card/OtherInputCard"
import AccountCard from "./card/AccountCard"

export default function LeftSideBar() {
  return (
    <div className="flex flex-col gap-4">
      <NavigationCard />
      <OtherInputCard />
      <AccountCard />
    </div>
  )
}
