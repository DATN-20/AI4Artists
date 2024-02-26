import LeftSideBar from "@/components/sidebar/NavigationSideBar"
import DashboardContent from "@/components/dashboard/DashboardContent"

export default async function Dashboard() {
  return (
    <div className="grid grid-cols-10 gap-4 p-4">
      <div className="col-span-2">
        <LeftSideBar />
      </div>
      <div className="col-span-8 ml-4 h-full w-full">
        <DashboardContent />
      </div>
    </div>
  )
}
