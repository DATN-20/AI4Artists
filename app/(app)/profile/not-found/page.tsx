"use client"

import NavigationSideBarCard from "@/components/sidebar/card/NavigationSideBarCard"
import { Button } from "@/components/ui/button"
import { FaUserTimes } from "react-icons/fa"

export default function NotFound() {
  return (
    <div className="flex h-screen gap-4">
      <div className="hidden lg:block lg:min-w-[300px]">
        <div className="no-scrollbar fixed left-0 top-0 flex h-screen min-h-screen w-[300px] flex-col gap-4 overflow-y-scroll bg-gray-100 p-4 shadow-lg">
          <NavigationSideBarCard />
        </div>
      </div>
      <div className="mr-4 flex h-full flex-1 items-center justify-center">
        <div className="text-center">
          <FaUserTimes className="mx-auto mb-4 text-6xl text-gray-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            User Not Found
          </h1>
          <p className="mb-4 text-gray-600">
            Sorry, we couldn't find the user you were looking for.
          </p>
          <a href={"/dashboard"}>
            <Button className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              Go Back Home
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
