import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import { TUserCredentialInterface } from "../../models/users-model/user-credential/TType";
import UserCredential from "../../models/users-model/user-credential/user-credential.model";
import { generateToken } from "../../utils/Token/Token.Util";

// User login
export const userLogin: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unknown Api call!!!",
      });
    }
    const { userEmailAddress, userPassword } =
      req.body as TUserCredentialInterface;
    if (!userEmailAddress || !userPassword) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Invalid email or password!!!",
      });
    }
    const user = await UserCredential.findOne({
      userEmailAddress: userEmailAddress,
    });
    if (!user) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Invalid credentials!!!",
      });
    }
    const isPasswordMatched = await bcrypt.compare(
      userPassword,
      user.userPassword
    );
    if (!isPasswordMatched) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Invalid credentials!!!",
      });
    }
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Logged in successfull!!!",
      Data: generateToken(user._id as string),
    });
  } catch (error) {
    return res.json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};
