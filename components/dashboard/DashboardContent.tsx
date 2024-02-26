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
import { useState } from "react"

export default function DashboardContent() {
  const [currentSelection, setCurrentSelection] = useState("Trending")

  // Function to handle selection
  const handleSelection = (selection: string) => {
    setCurrentSelection(selection)
  }
  return (
    <div>
      <div className="flex justify-between p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-primary rounded-xl px-4 py-3 text-lg font-bold text-white hover:bg-primary-800"
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
        <div className="bg-card flex items-center justify-center rounded-full px-4 ">
          <input
            type="text"
            placeholder="search"
            className="flex-grow bg-transparent text-black placeholder-white outline-none"
          />
          <Search />
        </div>
      </div>
      <div className="flex">
        <button
      </div>
    </div>
  )
}
