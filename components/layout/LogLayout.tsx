import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LogCard from "./LogCard"
import {
  useDeleteAllNotificationsMutation,
  useGetNotificationsQuery,
} from "@/services/generate/generateApi"
import { IoIosMailUnread } from "react-icons/io"
import { IoIosNotifications } from "react-icons/io"
import { LuTrash2 } from "react-icons/lu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

const LogLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLogVisible, setIsLogVisible] = useState(false)
  const { data: notifications, refetch } = useGetNotificationsQuery()
  const [filteredNotifications, setFilteredNotifications] = useState<
    NotificationInfo[]
  >([])
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (notifications) {
      let unReadMessages = notifications.filter(
        (notification: NotificationInfo) => !notification.is_read,
      )
      setFilteredNotifications(notifications)
      setUnreadCount(unReadMessages.length)
    }
  }, [notifications])

  const toggleLogVisibility = () => {
    setIsLogVisible(!isLogVisible)
  }

  const handleDeleteNotifications = async () => {
    await deleteAllNotifications()
    setFilteredNotifications([])
    setUnreadCount(0)
  }

  return (
    <>
      <div className="fixed bottom-0 right-0 z-50">
        {isLogVisible ? (
          <div className="relative h-80 w-96 rounded-md bg-card shadow-lg">
            <div className="flex h-full w-full">
              <Button
                onClick={toggleLogVisibility}
                className="h-full rounded-bl-md rounded-br-none rounded-tl-md rounded-tr-none p-0 hover:text-black"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
              <div className="flex w-full flex-col">
                <div className="sticky left-0 top-0 flex select-none items-center justify-between bg-primary-300 p-4 text-gray-800">
                  <h3 className="text-xl font-semibold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <LuTrash2 className="text-2xl hover:cursor-pointer hover:text-primary-700" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <h3 className="text-lg font-semibold">
                          Are you sure you want to delete all notifications?
                        </h3>
                        <AlertDialogFooter className="mt-5">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-500">
                            <Button
                              type="submit"
                              onClick={handleDeleteNotifications}
                              className="bg-transparent font-bold text-white hover:bg-transparent dark:hover:text-black"
                            >
                              Confirm
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <IoIosMailUnread className="text-2xl" />
                    <span>{unreadCount}</span>
                  </div>
                </div>
                <div className="no-scrollbar h-full overflow-y-auto">
                  {filteredNotifications.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        No notifications to show
                      </p>
                    </div>
                  )}
                  {filteredNotifications.map(
                    (notification: NotificationInfo) => (
                      <LogCard
                        key={notification.id}
                        title={notification.title}
                        content={notification.content}
                        createdAt={notification.created_at}
                        is_read={notification.is_read}
                        id={notification.id}
                        reference_data={notification.reference_data}
                        setUnreadCount={setUnreadCount}
                        setFilteredNotifications={setFilteredNotifications}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed bottom-0 right-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex w-full min-w-0 justify-start">
                  <Button
                    onClick={toggleLogVisibility}
                    className="h-10 w-10 rounded-sm bg-gradient-to-br from-sky-300 to-primary-700 to-80% px-0 hover:text-black"
                  >
                    <IoIosNotifications className="h-8 w-8" />
                    {unreadCount > 0 && (
                      <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Notifications</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      {children}
    </>
  )
}

export default LogLayout
