import express from "express";
import {
  details2FA,
  getDeviceDetails,
  getUserNameViaIpAddress,
  updatePreffered2FAMethod,
  update2FAPasskey,
  update2FASwitch,
  update2FAMethodAuthenticatorApp,
  update2FAMethodTextSMS,
  update2FAMethodSecurityKeys,
  update2FAMethodRecoveryCodes,
  updateUserDeviceDetails,
  userChangePassword,
  userCheck2FA,
  userDetails,
  userLogin,
  userLogout,
  generate2FAQRCode,
  verify2FACode,
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
privateRouteCommon
  .route("/user/fetch/user-details")
  .post(tokenProtect, userDetails);
privateRouteCommon.route("/user/check-2FA").post(tokenProtect, userCheck2FA);
privateRouteCommon
  .route("/user/update/device-details")
  .post(tokenProtect, updateUserDeviceDetails);
privateRouteCommon
  .route("/user/fetch/device-details")
  .post(tokenProtect, getDeviceDetails);
privateRouteCommon.route("/user/logout/device").post(tokenProtect, userLogout);
privateRouteCommon
  .route("/user/change-password")
  .post(tokenProtect, userChangePassword);
privateRouteCommon.route("/user/details-2FA").post(tokenProtect, details2FA);
privateRouteCommon
  .route("/user/update/preffered-2FA-method")
  .post(tokenProtect, updatePreffered2FAMethod);
privateRouteCommon
  .route("/user/update/2FA/passkey")
  .post(tokenProtect, update2FAPasskey);
privateRouteCommon
  .route("/user/update/2FA")
  .post(tokenProtect, update2FASwitch);
privateRouteCommon
  .route("/user/update/2FA/authenticator-app")
  .post(tokenProtect, update2FAMethodAuthenticatorApp);
privateRouteCommon
  .route("/user/update/2FA/Text/SMS")
  .post(tokenProtect, update2FAMethodTextSMS);
privateRouteCommon
  .route("/user/update/2FA/security-key")
  .post(tokenProtect, update2FAMethodSecurityKeys);
privateRouteCommon
  .route("/user/update/2FA/recovery-code")
  .post(tokenProtect, update2FAMethodRecoveryCodes);
privateRouteCommon
  .route("/user/2FA/generate/qr-code")
  .post(tokenProtect, generate2FAQRCode);
privateRouteCommon
  .route("/user/2FA/verify/otp-code")
  .post(tokenProtect, verify2FACode);

export { publicRouteCommon, privateRouteCommon };
