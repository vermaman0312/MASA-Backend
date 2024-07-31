import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ObjectId } from "mongoose";
import UserRole from "../../models/users-model/user-role/user-role.model";

dotenv.config();
const JWT_SECRET_KEY = process.env.KEY;

export const generateToken = (id: string) => {
  const token = jwt.sign({ id }, JWT_SECRET_KEY as string, {
    expiresIn: "1d",
  });
  return token;
};

export const generateTokenReference = (id: ObjectId) => {
  const token = jwt.sign({ id }, JWT_SECRET_KEY as string);
  return token;
};

export const decodeToken = async (bearerToken: string) => {
  try {
    const token = bearerToken.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY as string) as {
      id: ObjectId;
    };
    if (!decodedToken) {
      console.log("token");
    }
    const decodedId = decodedToken.id;
    if (!decodedId) {
      return null;
    }
    const user = await UserRole.findOne({ userId: decodedId });
    if (!user) {
      return null;
    }

    return {
      userId: decodedId,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      isStudent: user.isStudent,
      isEmployee: user.isEmployee,
    };
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      console.log("Token expired!!!");
      return null;
    } else {
      console.log("Invalid token!!!");
      return null;
    }
  }
};
