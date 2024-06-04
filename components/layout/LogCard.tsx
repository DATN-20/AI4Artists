import {
  useChangeNotificationStatusMutation,
  useGetNotificationImageMutation,
} from "@/services/generate/generateApi"
import React, { useState } from "react"
import { toast } from "react-toastify"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"
import NotificationImage from "./NotificationDialog"
import { ErrorObject } from "@/types"
import { BsThreeDots } from "react-icons/bs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const LogCard = ({
  title,
  content,
  createdAt,
  is_read,
  id,
  reference_data,
}: {
  title: string
  content: string
  createdAt: string
  is_read: boolean
  id: number
  reference_data: string | null
}) => {
  const [isRead, setIsRead] = useState<boolean>(is_read)
  const [open, setOpen] = useState(false)
  const [changeNotificationStatus] = useChangeNotificationStatusMutation()
  const [getNotificationImage, { data: notificationImage }] =
    useGetNotificationImageMutation()
  const changeToUnread = async () => {
    if (isRead) {
      setIsRead(false)
      changeNotificationStatus(id)
    }
  }

  const toggleRead = async () => {
    if (reference_data) {
      const result = await getNotificationImage(reference_data)
      if ((result as ErrorObject).error) {
        toast.error((result as ErrorObject).error.data.message)
      }
    }
    if (isRead) return
    setIsRead(true)
    changeNotificationStatus(id)
  }

  const notificationDisplayTime = () => {
    const date = new Date(createdAt)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minute = 1000 * 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7

    if (diff < minute) return "Now"
    if (diff < hour) return `${Math.floor(diff / minute)} mins ago`
    if (diff < day) return `${Math.floor(diff / hour)} hours ago`
    if (diff < week) return `${Math.floor(diff / day)} days ago`

    return date.toLocaleString()
  }

  return (
    <div>
      {reference_data ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogHeader className="hidden" />
          <DialogTrigger className="my-3 flex w-full text-start">
            <div
              className={`border-b p-4 ${isRead ? "text-gray-500" : "text-white"} flex items-center gap-4 hover:cursor-pointer hover:bg-gray-800`}
              onClick={toggleRead}
            >
              <div>
                <h4 className="line-clamp-2 font-bold">{title}</h4>
                <p className="line-clamp-2">{content}</p>
                <span className={`text-xs ${!isRead ? "text-primary" : ""}`}>
                  {notificationDisplayTime()}
                </span>
              </div>
              <div
                className={`${!isRead ? "h-[10px] w-[15px] rounded-full bg-primary" : ""}`}
              ></div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-scroll sm:max-w-[80vw] md:max-w-[60vw]">
            {notificationImage && (
              <NotificationImage
                style={notificationImage?.style || ""}
                prompt={notificationImage?.prompt || ""}
                images={notificationImage?.images || []}
              />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <div
          className={`group border-b p-4 ${isRead ? "text-gray-500" : "text-white"} flex items-center gap-4 hover:cursor-pointer hover:bg-gray-800`}
          onClick={toggleRead}
        >
          <div className="relative">
            <h4 className="line-clamp-2 font-bold">{title}</h4>
            <p className="line-clamp-2">{content}</p>
            <span className={`text-xs ${!isRead ? "text-primary" : ""}`}>
              {notificationDisplayTime()}
            </span>
            <div className="absolute right-4 top-1/2 z-10 hidden group-hover:block" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BsThreeDots className="text-primary bg-gray-500 rounded-full p-1 text-2xl flex justify-center items-center" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={changeToUnread}>
                    Mark as unread
                  </DropdownMenuItem>
                  <DropdownMenuItem>Remove this notification</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div
            className={`${!isRead ? "h-[10px] w-[15px] rounded-full bg-primary" : ""}`}
          ></div>
        </div>
      )}
    </div>
  )
}

export default LogCard
