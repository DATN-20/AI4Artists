"use client"

import DashboardContent from "@/components/dashboard/DashboardContent"
import NavigationSideBarCard from "@/components/sidebar/card/NavigationSideBarCard"
export default function Dashboard() {

  return (
    <div className="flex gap-4 py-4">
      <div className="hidden lg:block lg:min-w-[300px]">
        <div className="no-scrollbar fixed left-0 top-0 flex h-screen min-h-screen w-[300px] flex-col gap-4 overflow-y-scroll p-4 ">
          <NavigationSideBarCard />
        </div>
      </div>
      <div className="mr-4 h-full flex-1">
        <DashboardContent />
      </div>
    </div>
  )
}
