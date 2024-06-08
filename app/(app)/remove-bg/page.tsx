'use client'
import NavigationSideBarCard from "@/components/sidebar/card/NavigationSideBarCard"
import RemoveBackgroundProcessing from "@/components/processImage/removeBackground"

const RemoveBackgroundPage = () => {
  return (
    <div className="flex min-h-screen gap-4 py-4 overflow-scroll no-scrollbar">
      <div className="hidden lg:block lg:min-w-[300px]">
        <div className="no-scrollbar fixed left-0 top-0 flex h-screen min-h-screen w-[300px] flex-col gap-4 overflow-y-scroll p-4 ">
          <NavigationSideBarCard />
        </div>
      </div>
      <div className="mr-4 flex-1">
        <RemoveBackgroundProcessing />
      </div>
    </div>
  )
}

export default RemoveBackgroundPage
