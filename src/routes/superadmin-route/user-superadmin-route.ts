import express from "express";
import {
  addEmployeeRegistration,
  superAdminRegistration,
} from "../../controllers/superadmin-controller/user-superadmin-controller";
import {
  superAdminProtect,
  tokenProtect,
} from "../../middlewares/AuthenticationMiddleware/AuthenticationMiddleware/Authentication.Middleware";

const publicRouteSuperAdmin = express.Router();
const privateRouteSuperAdmin = express.Router();

// Public route
publicRouteSuperAdmin
  .route("/superadmin/register")
  .post(superAdminRegistration);

// Private route
privateRouteSuperAdmin
  .route("/superadmin/add-admin")
  .post(tokenProtect, superAdminProtect, addEmployeeRegistration);

export { publicRouteSuperAdmin, privateRouteSuperAdmin };
