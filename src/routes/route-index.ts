import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import {
  errorHandler,
  notFound,
} from "../middlewares/ErrorMiddleware/Error.Middleware";

// import routes //
// User authentication route //
import {
  privateRouteSuperAdmin,
  publicRouteSuperAdmin,
} from "./superadmin-route/user-superadmin-route";

// Define the method and origin //
const options = {
  origin: "*",
  methods:
    "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS, get, head, put, patch, post, delete, options",
  preflightContinue: true,
  optionsSuccessStatus: 204,
};

// define app and logic //
export const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// // Route //
const PUBLIC_ROUTE = "/api/v1/public/auth";
const PRIVATE_ROUTE = "/api/v1/private/auth";
// // User public route //
app.use(PUBLIC_ROUTE, [publicRouteSuperAdmin]);
// // User authentication route //
app.use(PRIVATE_ROUTE, [privateRouteSuperAdmin]);

// Error Handler //
app.use(notFound);
app.use(errorHandler);
