import express from "express";
import {
  getDeviceDetails,
  getUserNameViaIpAddress,
  updateUserDeviceDetails,
  userCheck2FA,
  userDetails,
  userLogin,
  userLogout,
} from "../../controllers/common-controller/common-controller";
import { tokenProtect } from "../../middlewares/AuthenticationMiddleware/AuthenticationMiddleware/Authentication.Middleware";

const publicRouteCommon = express.Router();
const privateRouteCommon = express.Router();

// Public route
publicRouteCommon
  .route("/user/fetch/user-details")
  .post(getUserNameViaIpAddress);
publicRouteCommon.route("/user/login").post(userLogin);

// Private route
privateRouteCommon.route("/user/fetch/user-details").post(tokenProtect, userDetails);
privateRouteCommon.route("/user/check-2FA").post(tokenProtect, userCheck2FA);
privateRouteCommon
  .route("/user/update/device-details")
  .post(tokenProtect, updateUserDeviceDetails);
privateRouteCommon
  .route("/user/fetch/device-details")
  .post(tokenProtect, getDeviceDetails);
privateRouteCommon.route("/user/logout/device").post(tokenProtect, userLogout);

export { publicRouteCommon, privateRouteCommon };
