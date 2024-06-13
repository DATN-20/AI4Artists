import { ChevronDown, Search } from "lucide-react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu"
import { useEffect, useState, useRef, useCallback } from "react"
import MansoryGrid from "./MansoryGrid"
import { useGetAllDashboardImageQuery } from "@/services/dashboard/dashboardApi"
import { DashboardImage } from "@/types/dashboard"
import Loading from "../Loading"

interface Selection {
  label: string
  value: string
}

const DashboardContent: React.FC = () => {
  const selectionList: Selection[] = [
    { label: "Random", value: "RANDOM" },
    { label: "Latest", value: "LATEST" },
    { label: "Top Liked", value: "TOPLIKED" },
    { label: "Trending", value: "TRENDING" },
  ]

  const [currentIndex, setCurrentIndex] = useState<number>(1)
  const [images, setImages] = useState<DashboardImage[]>([])
  const [page, setPage] = useState<number>(1)
  const limit = 20

  const isFetchingRef = useRef<boolean>(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleSelection = (index: number) => {
    setCurrentIndex(index)
    setPage(1)
    setImages([])
    refetch()
  }

  const { data, error, isLoading, refetch } = useGetAllDashboardImageQuery({
    type: selectionList[currentIndex].value,
    page,
    limit,
  })

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch images:", error)
    } else if (data) {
      setImages((prevImages) => [...prevImages, ...data.data])
      isFetchingRef.current = false
    }
  }, [error, data])

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading || isFetchingRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      isFetchingRef.current = true
      setPage((prevPage) => prevPage + 1)
    }
  }, [isLoading])

  useEffect(() => {
    const currentContainer = containerRef.current
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll)
      return () => currentContainer.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  return (
    <div
      ref={containerRef}
      className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 relative flex h-screen w-full flex-col overflow-y-scroll lg:p-2"
    >
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
                  className={`focus:text-primary-700 ${
                    index === currentIndex &&
                    "bg-slate-200 text-primary-800 dark:bg-gray-800"
                  }`}
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

      {isLoading ? (
        <div className="mt-20">
          <Loading />
        </div>
      ) : (
        <MansoryGrid data={images} />
      )}
    </div>
  )
}

export default DashboardContent
