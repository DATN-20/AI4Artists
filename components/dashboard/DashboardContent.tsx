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
import {
  useGetAllDashboardImageQuery,
  useGetSearchImageQuery,
} from "@/services/dashboard/dashboardApi" // Correct import
import Loading from "../Loading"
import React from "react" // Import React for typing events

interface Selection {
  label: string
  value: string
}

export default function DashboardContent() {
  const [currentSelection, setCurrentSelection] = useState<Selection>({
    label: "Latest",
    value: "LATEST",
  })

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false)
  const [displaySearch, setDisplaySearch] = useState<boolean>(false)

  const handleSelection = (selection: Selection) => {
    setCurrentSelection(selection)
  }

  const handleSearchSubmit = () => {
    setTriggerSearch(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchSubmit()
    }
  }

  const { data, error, isLoading } = useGetAllDashboardImageQuery({
    type: currentSelection.value,
    page: 1,
    limit: 100,
  })

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearchLoading,
  } = useGetSearchImageQuery(
    {
      query: searchTerm,
      page: 1,
      limit: 100,
    },
    { skip: !triggerSearch },
  )

  useEffect(() => {
    if (triggerSearch) {
      setTriggerSearch(false)
      setDisplaySearch(true)
    }
  }, [searchData, searchError])

  useEffect(() => {
    if (searchTerm === "") {
      setDisplaySearch(false)
    }
  }, [searchTerm])

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch images:", error)
    }
    if (searchError) {
      console.error("Failed to fetch images:", searchError)
    }
  }, [error, searchError])

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
        <div className="flex items-center justify-center rounded-full bg-card px-4">
          <input
            type="text"
            placeholder="search"
            className="flex-grow bg-transparent placeholder-white outline-none"
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search onClick={handleSearchSubmit} className="cursor-pointer" />
        </div>
      </div>
      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-scroll">
        <Button
          className="rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
          variant={"outline"}
        >
          All
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold">
          Photography
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold">
          Animals
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold">
          Anime
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold">
          Architecture
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold">Food</Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold">
          Sci-fi
        </Button>
      </div>
      {isLoading || isSearchLoading ? (
        <Loading />
      ) : (
        <MansoryGrid data={displaySearch ? searchData?.data : data?.data} />
      )}
    </div>
  )
}
