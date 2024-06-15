// WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { toast } from "react-toastify"
import createSocket from "../services/socket"

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
  const socketRef = useRef<Socket | null>(null)

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
        toast.info(`New notification: ${notification.title}`)
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
