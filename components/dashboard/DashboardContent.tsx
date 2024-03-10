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
import { useCallback, useEffect, useState } from "react"
import MansoryGrid from "./MansoryGrid"

export default function DashboardContent() {
  const [currentSelection, setCurrentSelection] = useState("Trending")

  // Function to handle selection
  const handleSelection = (selection: string) => {
    setCurrentSelection(selection)
  }

  return (
    <div className="flex w-full flex-col lg:p-2">
      <div className="flex w-full justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-xl px-4 py-3 text-lg font-bold text-white hover:bg-primary-800">
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
            className="flex-grow bg-transparent  placeholder-white outline-none"
          />
          <Search />
        </div>
      </div>
      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-scroll">
        <Button
          className="rounded-xl border-[2px] px-6 py-2 font-bold"
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

      <MansoryGrid />
    </div>
  )
}
