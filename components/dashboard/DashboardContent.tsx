import { ChevronDown, Search } from "lucide-react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu"
import { useEffect, useState } from "react"
import MansoryGrid from "./MansoryGrid"
import { useGetAllDashboardImageQuery } from "@/services/dashboard/dashboardApi"
import Loading from "../Loading"
import { DashboardImage } from "@/types/dashboard"

export default function DashboardContent() {
  const selectionList = [
    { label: "Random", value: "RANDOM" },
    { label: "Latest", value: "LATEST" },
    { label: "Top Liked", value: "TOPLIKED" },
    { label: "Trending", value: "TRENDING" },
  ]

  const [currentIndex, setCurrentIndex] = useState<number>(1)
  const [images, setImages] = useState<DashboardImage[] | undefined>(undefined)

  const handleSelection = (index: number) => {
    setCurrentIndex(index)
    refetch()
  }

  const { data, error, isLoading, refetch } = useGetAllDashboardImageQuery({
    type: selectionList[currentIndex].value,
    page: 1,
    limit: 100,
  })

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch images:", error)
    } else if (data) {
      setImages(data.data)
    }
  }, [error, data])

  return (
    <div className="flex w-full flex-col lg:p-2">
      <div className="flex w-full justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-xl bg-gradient-default px-4 py-3 text-lg font-bold text-white shadow-none hover:bg-primary-800 focus-visible:ring-0">
              {selectionList[currentIndex].label}
              <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuGroup>
              {selectionList.map((selection, index) => (
                <DropdownMenuItem
                  className={`focus:text-primary-700 ${index === currentIndex && "text-primary-800 bg-slate-200"}`}
                  key={index}
                  onClick={() => handleSelection(index)}
                >
                  {selection.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center justify-center rounded-full bg-card px-4 ">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow bg-transparent outline-none dark:placeholder-white"
          />
          <Search />
        </div>
      </div>
      {isLoading ? <Loading /> : <MansoryGrid data={images} />}
    </div>
  )
}
