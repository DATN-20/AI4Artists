import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LogCard from "./LogCard"
import { useGetNotificationsQuery } from "@/services/generate/generateApi"
import { IoIosMailUnread } from "react-icons/io"
import { IoIosNotifications } from "react-icons/io"

const LogLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLogVisible, setIsLogVisible] = useState(false)
  const [pollingInterval, setPollingInterval] = useState(3000)
  const { data: notifications, refetch } = useGetNotificationsQuery()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (notifications) {
      setUnreadCount(
        notifications.filter(
          (notification: NotificationInfo) => !notification.is_read,
        ).length,
      )
    }
  }, [notifications])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isLogVisible) {
      interval = setInterval(() => {
        refetch()
      }, pollingInterval)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isLogVisible, pollingInterval, refetch])

  const toggleLogVisibility = () => {
    setIsLogVisible(!isLogVisible)
  }

  return (
    <>
      <div className="fixed bottom-0 right-0 z-50">
        {isLogVisible ? (
          <div className="relative h-80 w-96 rounded-md bg-card shadow-lg">
            <div className="flex h-full w-full">
              <Button
                onClick={toggleLogVisibility}
                className="h-full rounded-bl-md rounded-br-none rounded-tl-md rounded-tr-none p-0"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
              <div className="flex w-full flex-col">
                <div className="sticky left-0 top-0 flex items-center justify-between select-none p-4 bg-primary-300 text-gray-800">
                  <h3 className="text-xl font-semibold">Notifications</h3>
                  <div className="flex items-center gap-1">
                    <IoIosMailUnread className="text-2xl" />
                    <span>{unreadCount}</span>
                  </div>
                </div>
                <div className="overflow-y-auto no-scrollbar">
                  {notifications?.map((notification: NotificationInfo) => (
                    <LogCard
                      key={notification.id}
                      title={notification.title}
                      content={notification.content}
                      createdAt={notification.created_at}
                      is_read={notification.is_read}
                      id={notification.id}
                      reference_data = {notification.reference_data}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={toggleLogVisibility}
            className="fixed bottom-0 right-0 h-10 w-10 rounded px-0"
          >
            <IoIosNotifications className="h-8 w-8" />
            {unreadCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        )}
      </div>
      {children}
    </>
  )
}

export default LogLayout
