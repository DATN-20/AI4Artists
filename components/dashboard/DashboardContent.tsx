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

export default function DashboardContent() {
  const [currentSelection, setCurrentSelection] = useState({
    label: "Latest",
    value: "LATEST",
  })

  const handleSelection = (selection: { label: string; value: string }) => {
    setCurrentSelection(selection)
  }

  const { data, error, isLoading } = useGetAllDashboardImageQuery({
    type: currentSelection.value,
    page: 1,
    limit: 100,
  })

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch images:", error)
    
    }
  }, [error, data])



  return (
    <div className="flex w-full flex-col lg:p-2">
      <div className="flex w-full justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-xl bg-gradient-default px-4 py-3 text-lg font-bold text-white shadow-none hover:bg-primary-800">
              {currentSelection.label}
              <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() =>
                  handleSelection({ label: "Random", value: "RANDOM" })
                }
              >
                Random
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  handleSelection({ label: "Latest", value: "LATEST" })
                }
              >
                Latest
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  handleSelection({ label: "Top Liked", value: "TOPLIKED" })
                }
              >
                Top Liked
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  handleSelection({ label: "Trending", value: "TRENDING" })
                }
              >
                Trending
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center justify-center rounded-full bg-card px-4 ">
          <input
            type="text"
            placeholder="search"
            className="flex-grow bg-transparent placeholder-white outline-none"
          />
          <Search />
        </div>
      </div>
      {isLoading ? <Loading /> : <MansoryGrid data={data.data} />}
    </div>
  )
}
