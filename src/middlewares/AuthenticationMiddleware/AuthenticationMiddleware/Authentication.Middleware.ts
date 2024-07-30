import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction, RequestHandler } from "express";
import userRole from "../../../models/users-model/user-role/user-role.model";
import { IAuthenticationType } from "../Model/Authentication.DataType";
import { TUserRoleInterface } from "../../../models/users-model/user-role/TType";

dotenv.config();
const JWT_SECRET = process.env.KEY;

declare module "express" {
  interface Request {
    user?: unknown;
  }
}

export const tokenProtect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded: unknown = jwt.verify(token, JWT_SECRET as string);
      const decodedPayload = decoded as IAuthenticationType;
      req.user = await userRole
        .findOne({ userId: decodedPayload.id })
        .select("-password");
      if (decoded) {
        if (req.user) {
          req.user;
          next();
        } else {
          return res.json({
            Type: "Success",
            Success: false,
            Status: 401,
            Message: "Please authenticate!!!",
          });
        }
      } else {
        return res.json({
          Type: "Success",
          Success: false,
          Status: 401,
          Message: "Invalid token!!!",
        });
      }
    } else {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Please authenticate!!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

export const studentProtect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as TUserRoleInterface & Document;
    if (!user || !user.isStudent) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Please authenticate!!!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

export const teacherProtect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as TUserRoleInterface & Document;
    if (!user || !user.isTeacher) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Please authenticate!!!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

export const adminProtect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as TUserRoleInterface & Document;
    if (!user || !user.isAdmin) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Please authenticate!!!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

export const superAdminProtect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as TUserRoleInterface & Document;
    if (!user || !user.isSuperAdmin) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Please authenticate!!!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};
