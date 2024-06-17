import { io, Socket } from "socket.io-client"

const createSocket = (userId: string, token: string): Socket => {
  return io("https://socket.mangahay.top/", {
    query: {
      userId,
      token,
    },
    transports: ["websocket"],
  })
}

export default createSocket
