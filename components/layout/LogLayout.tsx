import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LogCard from "./LogCard"
import { useGetNotificationsQuery } from "@/services/generate/generateApi"

const LogLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLogVisible, setIsLogVisible] = useState(false)
  const [pollingInterval, setPollingInterval] = useState(3000) 
  const { data: notifications, refetch } = useGetNotificationsQuery()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isLogVisible) {
      interval = setInterval(() => {
        refetch();
      }, pollingInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLogVisible, pollingInterval, refetch]);

  const toggleLogVisibility = () => {
    setIsLogVisible(!isLogVisible)
  }

  return (
    <>
      <div className="fixed bottom-0 right-0 z-50">
        {isLogVisible ? (
          <div className="relative h-64 w-96 rounded-md bg-card shadow-lg">
            <div className="flex h-full w-full">
              <Button
                onClick={toggleLogVisibility}
                className="h-full rounded-bl-md rounded-br-none rounded-tl-md rounded-tr-none p-0"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
              <div className="flex w-full flex-col overflow-y-auto">
                {notifications?.map((notification: any) => (
                  <LogCard
                    key={notification.id}
                    title={notification.title}
                    content={notification.content}
                    createdAt={notification.created_at}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={toggleLogVisibility}
            className="fixed bottom-0 right-0 h-64 rounded px-0"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
      </div>
      {children}
    </>
  )
}

export default LogLayout
