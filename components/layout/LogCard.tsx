import { useChangeNotificationStatusMutation } from "@/services/generate/generateApi"
import React, { useState } from "react"

const LogCard = ({
  title,
  content,
  createdAt,
  is_read,
  id
}: {
  title: string
  content: string
  createdAt: string
  is_read: boolean
  id: number
}) => {
  const [isRead, setIsRead] = useState<boolean>(is_read)
  const [changeNotificationStatus] = useChangeNotificationStatusMutation()

  const toggleRead = () => {
    if (isRead) return
    setIsRead(true)
    changeNotificationStatus(id)
  }

  return (
    <div>
      <div
        className={`border-b p-4 ${isRead ? "text-gray-500" : "text-white"} hover:cursor-pointer hover:bg-gray-800 flex content-center items-center gap-4`}
        onClick={toggleRead}
      >
        <div>
          <h4 className="font-bold">{title}</h4>
          <p>{content}</p>
          <span className={`text-xs ${!isRead ? "text-primary" : ""}`}>
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
        <div className={`${!isRead ? "bg-primary w-[15px] h-[10px] rounded-full" : ""}`}></div>
      </div>
    </div>
  )
}

export default LogCard
