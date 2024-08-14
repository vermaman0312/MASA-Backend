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

//====================================================//
/*
  Logical Question Solve
*/
/*
  Q. User can give the number and output should be
  1
  22
  333
*/
// Code here...
// function question1(n: number) {
//   let result = "";
//   for (let i = 0; i <= n; i++) {
//     result += i.toString().repeat(i);
//     result += "\n";
//   }
//   console.log(result);
// }
// question1(5);

/*
  Q. User can give the number and output should be
  333
  22
  1
*/
// Code here...
// function question2(n: number) {
//   let result = "";
//   for (let i = n; i > 0; i--) {
//     result += i.toString().repeat(i);
//     result += "\n";
//   }
//   console.log(result);
// }
// question2(5);

/*
  Q. User can give the number and output should be
  54321
  5432
  543
  54
  5
*/
// Code here...
// function question3(n: number) {
//   let result = "";
//   for (let i = n; i > 0; i--) {
//     for (let j = n; j > n - i; j--) {
//       result += j.toString();
//     }
//     result += "\n";
//   }
//   console.log(result.trim());
// }
// question3(5);

/*
  Q. User can give the number and output should be
  333222111
  332211
  321
*/
// Code here...
function question4(n: number) {
  let result = "";
  for (let i = n; i > 0; i--) {
    for (let j = n; j > n - i; j--) {
      result += j.toString().repeat(i);
    }
    result += "\n";
  }
  console.log(result.trim());
}
question4(3);
