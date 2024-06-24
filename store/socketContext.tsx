// WebSocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { io, Socket } from "socket.io-client"
import { toast } from "react-toastify"
import createSocket from "../services/socket"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  useGetGenerationHistoryQuery,
  useGetNotificationImageQuery,
  useGetNotificationsQuery,
} from "@/services/generate/generateApi"
import { ErrorObject } from "@/types"
import NotificationImage from "@/components/layout/NotificationDialog"

interface WebSocketContextProps {
  socket: Socket | null
}

const WebSocketContext = createContext<WebSocketContextProps>({ socket: null })

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider: React.FC<{
  userId: string
  token: string
  children: React.ReactNode
}> = ({ userId, token, children }) => {
  const [referenceData, setReferenceData] = useState<string>("")
  const [open, setOpen] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const { data: notificationImage, refetch } = useGetNotificationImageQuery(
    referenceData || "",
  )
  const { data: notifications, refetch: refetchNotifications } =
    useGetNotificationsQuery()
  const { data: historyData, refetch: refetchHistory } =
    useGetGenerationHistoryQuery()

  const notificationDisplayTime = (createdAt: string) => {
    const date = new Date(createdAt)
    return date.toLocaleString()
  }

  const toggleRead = async (reference_data: string) => {
    if (reference_data) {
      setReferenceData(reference_data)
      const result = await refetch()
      if ((result as ErrorObject).error) {
        toast.error((result as ErrorObject).error.data.message)
      }
    }
  }

  const renderNotificationContent = (notification: any) =>
    notification.reference_data ? (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="hidden" />
        <DialogTrigger className="my-3 flex w-full text-start">
          <div
            onClick={() => {
              toggleRead(notification.reference_data)
            }}
          >
            <h4 className="font-bold">{notification.title}</h4>
            <p>{notification.content}</p>
            <span className={`text-xs text-primary`}>
              {notificationDisplayTime(notification.created_at)}
            </span>
            <div className={`h-[10px] w-[15px] rounded-full`}></div>
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
      <div>
        <h4 className="font-bold">{notification.title}</h4>
        <p>{notification.content}</p>
        <span className={`text-xs text-primary`}>
          {notificationDisplayTime(notification.created_at)}
        </span>
        <div className={`h-[10px] w-[15px] rounded-full`}></div>
      </div>
    )

  useEffect(() => {
    if (!socketRef.current) {
      const socket = createSocket(userId, token)

      socket.on("connect", () => {
        console.log("Connected to WebSocket server")
      })

      socket.on("connect_error", (error) => {
        toast.error(`WebSocket connection error: ${error.message}`)
      })

      // Listen for notifications
      // Improve in the future, css the Toast

      socket.on("notification", (notification) => {
        toast.info(renderNotificationContent(notification))
        refetchNotifications()
        if (notification.reference_data) {
          refetchHistory()
        }
      })

      socketRef.current = socket
    }

    return () => {
      socketRef.current?.close()
      socketRef.current = null
    }
  }, [userId, token])

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </WebSocketContext.Provider>
  )
}
