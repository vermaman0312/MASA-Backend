import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import { TUserCredentialInterface } from "../../models/users-model/user-credential/TType";
import UserCredential from "../../models/users-model/user-credential/user-credential.model";
import { decodeToken, generateToken } from "../../utils/Token/Token.Util";
import {
  ILocationType,
  TUserDeviceInterface,
} from "../../models/users-model/user-device/TType";
import UserDevice from "../../models/users-model/user-device/user-device.model";

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
        Message: "Invalid credential!!!",
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
        Message: "Invalid credential!!!",
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

// Check two factor authentication
export const userCheck2FA: RequestHandler = async (
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
    const authorizationData = req.headers.authorization;
    const loggedInUser = await decodeToken(authorizationData as string);
    const userDetails2FA = await UserCredential.findById(loggedInUser?.userId);
    if (!userDetails2FA?.user2FA) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Two factor authentication is not enabled!!!",
      });
    }
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Two factor authentication enabled!!!",
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

// Update user device details
export const updateUserDeviceDetails: RequestHandler = async (
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
    const authorizationData = req.headers.authorization;
    const loggedInUser = await decodeToken(authorizationData as string);
    const {
      browserName,
      browserVersion,
      browserId,
      browserOS,
      browserEngine,
      ipAddress,
      macAddress,
    } = req.body as TUserDeviceInterface;
    const { longitude, latitude } = req.body as ILocationType;
    if (
      !browserName ||
      !browserVersion ||
      !browserId ||
      !browserOS ||
      !browserEngine ||
      !ipAddress ||
      !macAddress ||
      !longitude ||
      !latitude
    ) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 400,
        Message: "Invalid device details!!!",
      });
    }
    const userDeviceDetails = await UserDevice.findOneAndUpdate(
      { userId: loggedInUser?.userId },
      {
        loggedInStatus: "active",
        browserName: browserName ? browserName : undefined,
        browserVersion: browserVersion ? browserVersion : undefined,
        browserId: browserId ? browserId : undefined,
        browserOS: browserOS ? browserOS : undefined,
        browserEngine: browserEngine ? browserEngine : undefined,
        ipAddress: ipAddress ? ipAddress : undefined,
        macAddress: macAddress ? macAddress : undefined,
        location: {
          longitude: longitude,
          latitude: latitude,
        },
      }
    );
    if (!userDeviceDetails) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "User device details not found!!!",
      });
    }
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "User device details updated successfully!!!",
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

// Logout user device
export const userLogout: RequestHandler = async (
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
    const authorizationData = req.headers.authorization;
    const loggedInUser = await decodeToken(authorizationData as string);
    const userDeviceDetails = await UserDevice.findOneAndUpdate(
      { userId: loggedInUser?.userId },
      {
        loggedInStatus: "inactive",
      }
    );
    if (!userDeviceDetails) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "Something went wrong!!!",
      });
    }
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "User device logged out successfully!!!",
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
