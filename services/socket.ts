import { io, Socket } from "socket.io-client"

const createSocket = (userId: string, token: string): Socket => {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    query: {
      userId,
      token,
    },
    transports: ["websocket"],
  })
}

export default createSocket
