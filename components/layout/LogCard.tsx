import {
  useChangeNotificationStatusMutation,
  useGetNotificationImageQuery,
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

const LogCard = ({
  title,
  content,
  createdAt,
  is_read,
  id,
  reference_data,
  setUnreadCount,
  setFilteredNotifications,
}: {
  title: string
  content: string
  createdAt: string
  is_read: boolean
  id: number
  reference_data: string | null
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>
  setFilteredNotifications: React.Dispatch<React.SetStateAction<NotificationInfo[]>>
}) => {
  const [isRead, setIsRead] = useState<boolean>(is_read)
  const [open, setOpen] = useState(false)
  const [changeNotificationStatus] = useChangeNotificationStatusMutation()
  const { data: notificationImage, refetch } = useGetNotificationImageQuery(
    reference_data || "",
  )

  const toggleRead = async () => {
    if (reference_data) {
      const result = await refetch()
      if ((result as ErrorObject).error) {
        toast.error((result as ErrorObject).error.data.message)
      }
    }
    if (isRead) return
    setIsRead(true)
    changeNotificationStatus(id)
    setUnreadCount((prev) => prev - 1)
    setFilteredNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === id) {
          return { ...notification, is_read: true }
        }
        return notification
      }),
    )
  }

  const notificationDisplayTime = () => {
    const date = new Date(createdAt)
    return date.toLocaleString()
  }

  return (
    <div>
      {reference_data ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogHeader className="hidden" />
          <DialogTrigger className="my-3 flex w-full text-start">
            <div
              className={`border-b p-4 ${isRead ? "text-gray-500" : "text-gray-800 dark:text-white"} flex items-center gap-4 hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-800`}
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
                className={`${!isRead ? "h-[10px] w-[15px] rounded-full" : ""}`}
              ></div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[80vw] md:max-w-[75vw]">
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
          className={`group border-b p-4 ${isRead ? "text-gray-500" : "text-gray-800 dark:text-white"} flex items-center gap-4 hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-800`}
          onClick={toggleRead}
        >
          <div className="relative">
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
      )}
    </div>
  )
}

export default LogCard
