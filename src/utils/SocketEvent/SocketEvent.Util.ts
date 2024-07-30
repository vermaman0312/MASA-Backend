import { Socket } from "socket.io";
import { ExtendedSocket } from "../../middlewares/AuthenticationMiddleware/Model/Socket.DataType";
import { io } from "../../middlewares/AuthenticationMiddleware/AuthenticationSocketMiddleware/Authentication.Socket.Middleware";

console.log("io in socketEvent.ts:", io);

io.on("connection", (socket: Socket) => {
  const extendedSocket = socket as ExtendedSocket;

  extendedSocket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("json", roomId);
  });
});
