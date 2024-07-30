import http from "http";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { app } from "./routes/route-index";
import { authSocket } from "./middlewares/AuthenticationMiddleware/AuthenticationSocketMiddleware/Authentication.Socket.Middleware";

dotenv.config();
const server = http.createServer(app);
authSocket(server);

const DBURL = process.env.MONGO_URL;
const port = process.env.PORT;
if (!DBURL) {
  throw new Error("Invalid monogoDB URL");
}
// MongoDB connection
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Database connected!!!");
  })
  .catch((err) => console.log(err));
server.listen(port, () => {
  console.log(
    `${"Server is running on port"} ${process.env.BACKEND_URL}${port}`
  );
});
