import { Server as HttpServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { ExtendedSocket } from "../Model/Socket.DataType";
import { ExtendedError } from "socket.io/dist/namespace";
import { decodeToken } from "../../../utils/Token/Token.Util";

export let io: SocketIOServer;

export const authSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: ["*"],
      methods: [
        "POST",
        "GET",
        "HEAD",
        "OPTIONS",
        "PUT",
        "DELETE",
        "PATCH",
      ],
    },
  });

  io.use((socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    const token = (socket as ExtendedSocket).handshake.auth.token;
    if (!token) {
      return next(new Error("Not authorized!!!"));
    }
    const userId = decodeToken(token);
    if (!userId) {
      return next(new Error("Invalid token!!!"));
    }
    (socket as ExtendedSocket).userId = userId.toString();
    next();
  });

  return io;
};
