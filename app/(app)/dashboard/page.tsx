import LeftSideBar from "@/components/sidebar/LeftSideBar"

export default async function Dashboard() {
  return (
    <div className="grid grid-cols-8 gap-4 p-4">
      <div className="col-span-2">
        <LeftSideBar />
      </div>
      <div className="col-span-6 ml-4 h-full w-full">
        <div>ahaha</div>
      </div>
    </div>
  )
}
