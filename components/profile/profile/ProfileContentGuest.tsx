import { Search } from "lucide-react"
import MansoryGrid from "../../dashboard/MansoryGrid"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { FaFilter, FaSort } from "react-icons/fa"
import { DashboardImage } from "@/types/dashboard"

const ProfileContentGuest = ({
  imagesData,
}: {
  imagesData: DashboardImage[] | undefined
}) => {
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="mt-3">
        <span className=" bg-clip-text text-4xl font-black dark:text-white">
          Images
        </span>
      </div>{" "}
      <div className="flex flex-col lg:flex-row">
        {/* <div className="flex items-center justify-center rounded-full bg-card px-4">
          <input
            type="text"
            placeholder="Prompt"
            className="flex-grow bg-transparent p-2 placeholder-black outline-none dark:placeholder-white"
          />
          <Search className="dark:text-white" />
        </div> */}
        {/* <div className="mt-4 flex gap-4 lg:mt-0">
          <Select>
            <SelectTrigger className=" w-[180px] bg-white dark:bg-zinc-800 lg:ml-5">
              <FaFilter />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="alphabet">Alphabet</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-800 lg:ml-5">
              <FaSort />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="descending">
                  Time Created: Descending
                </SelectItem>
                <SelectItem value="ascending">
                  Time Created: Ascending
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
      </div>
      <MansoryGrid data={imagesData} />
    </div>
  )
}

export default ProfileContentGuest
