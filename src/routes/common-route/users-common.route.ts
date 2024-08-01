import express from "express";
import { userLogin } from "../../controllers/common-controller/common-controller";

const publicRouteCommon = express.Router();

// Public route
publicRouteCommon.route("/user/login").post(userLogin);

export { publicRouteCommon };
