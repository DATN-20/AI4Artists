import { Card } from "antd"
import CardSection from "./card-section/CardSection"
import {
  FacebookFilled,
  InstagramFilled,
  TwitterSquareFilled,
  DiscordFilled,
} from "@ant-design/icons"
const AccountCard = () => {
  return (
    <Card className=" bg-black">
      <div className="flex flex-col gap-3">
        <CardSection title="Log out" href="#" isOpen={true} />
        <CardSection title="username" href="#" isOpen={false} />
        <div className="flex gap-3 ">
          <FacebookFilled style={{ fontSize: "36px", color: "white" }} />
          <InstagramFilled style={{ fontSize: "36px", color: "white" }} />
          <TwitterSquareFilled style={{ fontSize: "36px", color: "white" }} />
          <DiscordFilled style={{ fontSize: "36px", color: "white" }} />
        </div>
      </div>
    </Card>
  )
}

export default AccountCard
