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
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useDeferredValue,
} from "react"
import MansoryGrid from "./MansoryGrid"
import {
  useGetAllDashboardImageQuery,
  useGetSearchImageQuery,
} from "@/services/dashboard/dashboardApi"
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
  const [showSmallLoading, setShowSmallLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [searchResults, setSearchResults] = useState<DashboardImage[]>([])
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

  const { data: searchData, refetch: refetchSearch } = useGetSearchImageQuery(
    {
      query: deferredSearchQuery,
      page: 1,
      limit: limit,
    },
    { skip: !deferredSearchQuery },
  )

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch images:", error)
    } else if (data) {
      setImages((prevImages) => [...prevImages, ...data.data])
      isFetchingRef.current = false
    }
  }, [error, data])

  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData.data)
    }
  }, [searchData])

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading || isFetchingRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      isFetchingRef.current = true
      setShowSmallLoading(true)
      setPage((prevPage) => prevPage + 1)
      setTimeout(() => {
        setShowSmallLoading(false)
      }, 1000)
    }
  }, [isLoading])

  useEffect(() => {
    const currentContainer = containerRef.current
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll)
      return () => currentContainer.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    if (deferredSearchQuery) {
      refetchSearch()
    }
  }, [deferredSearchQuery, refetchSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div
      ref={containerRef}
      className="scrollbar-thumb-rounded no-scrollbar relative flex h-screen w-full flex-col overflow-y-scroll scrollbar-thumb-gray-500 lg:p-2"
    >
      <div className="flex w-full justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gradient-default-to-r hover:text-black rounded-xl px-4 py-3 text-lg font-bold text-white shadow-none hover:bg-primary-800 focus-visible:ring-0">
              {selectionList[currentIndex].label}
              <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuGroup>
              {selectionList.map((selection, index) => (
                <DropdownMenuItem
                  className={`focus:text-primary-700 hover:cursor-pointer ${
                    index === currentIndex &&
                    "bg-slate-200 font-bold text-primary-700 dark:bg-gray-800"
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
            placeholder="Search prompt"
            value={searchQuery}
            onChange={handleSearchChange}
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
        <MansoryGrid data={searchQuery ? searchResults : images} />
      )}

      {showSmallLoading && (
        <div className="fixed bottom-8 right-8 z-50">
          <div role="status">
            <svg
              aria-hidden="true"
              className="h-16 w-16 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>{" "}
        </div>
      )}
    </div>
  )
}

export default DashboardContent
