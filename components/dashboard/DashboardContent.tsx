import React from "react"
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
import Loading from "../Loading"
import { DashboardImage } from "@/types/dashboard"
import axiosInstance from "@/axiosInstance"

interface CurrentSelection {
  label: string
  value: string
}

export default function DashboardContent() {
  const [currentSelection, setCurrentSelection] = useState<CurrentSelection>({
    label: "Latest",
    value: "LATEST",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState<DashboardImage[]>([])
  const [filteredData, setFilteredData] = useState<DashboardImage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSelection = (selection: CurrentSelection) => {
    setCurrentSelection(selection)
  }

  const fetchData = async (type: string, page: string, limit: string) => {
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams()
      if (type) searchParams.append("type", type)
      if (page) searchParams.append("page", page)
      if (limit) searchParams.append("limit", limit)

      const response = await axiosInstance.get(
        `/api/v1/images/dashboard?${searchParams}`,
      )
      setData(response.data.data)
    } catch (err) {
      console.error("Failed to fetch images:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(currentSelection.value, "1", "100")
  }, [currentSelection])

  const handleSearch = () => {
    if (searchTerm !== "") {
      const filtered = data.filter((item) =>
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData([])
    }
  }

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
            placeholder="Search"
            className="flex-grow bg-transparent placeholder-white outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <Search onClick={handleSearch} />
        </div>
      </div>
      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-scroll">
        <Button
          className="rounded-xl border-[2px] px-6 py-2 font-bold text-primary-700"
          variant={"outline"}
        >
          All
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold ">
          Photography
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold ">
          Animals
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold ">
          Anime
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold ">
          Architecture
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold ">
          Food
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold ">
          Sci-fi
        </Button>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <MansoryGrid
          data={
            searchTerm !== "" && filteredData.length > 0 ? filteredData : data
          }
        />
      )}
    </div>
  )
}
