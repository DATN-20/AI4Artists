"use client"
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

export default function DashboardContent() {
  const [currentSelection, setCurrentSelection] = useState("Trending")

  // Function to handle selection
  const handleSelection = (selection: string) => {
    setCurrentSelection(selection)
  }

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="hover:bg-primary-800 rounded-xl bg-primary px-4 py-3 text-lg font-bold text-white"
            >
              {currentSelection}
              <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => handleSelection("Trending")}>
                Trending
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSelection("New")}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSelection("Top")}>
                Top
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center justify-center rounded-full bg-card px-4 ">
          <input
            type="text"
            placeholder="search"
            className="flex-grow bg-transparent text-black placeholder-white outline-none"
          />
          <Search />
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <Button className="bg-primary-600 rounded-xl px-6 py-2 font-bold text-white">
          All
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold text-white">
          Photography
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold text-white">
          Animals
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold text-white">
          Anime
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold text-white">
          Architecture
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold text-white">
          Food
        </Button>
        <Button className="rounded-xl bg-card px-6 py-2 font-bold text-white">
          Sci-fi
        </Button>
      </div>
    </div>
  )
}
