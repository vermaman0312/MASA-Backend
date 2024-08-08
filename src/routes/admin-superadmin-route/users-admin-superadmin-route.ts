import express from "express";
import {
  addEmployeeRegistration,
  addStudentRegistration,
  allUsersListsWithFilter,
  superAdminRegistration,
} from "../../controllers/admin-superadmin-controller/users-admin-superadmin.controller";
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
  .route("/superadmin/add-employee")
  .post(tokenProtect, superAdminProtect, addEmployeeRegistration);
privateRouteSuperAdmin
  .route("/superadmin/add-student")
  .post(tokenProtect, superAdminProtect, addStudentRegistration);
privateRouteSuperAdmin
  .route("/superadmin/user-list")
  .post(tokenProtect, superAdminProtect, allUsersListsWithFilter);

export { publicRouteSuperAdmin, privateRouteSuperAdmin };
