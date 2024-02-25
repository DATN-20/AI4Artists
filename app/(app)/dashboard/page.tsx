import LeftSideBar from "@/components/sidebar/LeftSideBar"
import { Row, Col } from "antd"

export default async function Dashboard() {
  return (
    <Row className="p-4">
      <Col span={6}>
        <LeftSideBar />
      </Col>
      <Col span={18} className="">
        <div className="ml-4 h-full w-full">ahaha</div>
      </Col>
    </Row>
  )
}
