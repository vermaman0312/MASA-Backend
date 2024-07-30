import { Request, RequestHandler, Response } from "express";
import { TUserCredentialInterface } from "../../models/users-model/user-credential/TType";
import UserCredential from "../../models/users-model/user-credential/user-credential.model";
import UserDetails from "../../models/users-model/user-details/user-details.model";
import UserDevice from "../../models/users-model/user-device/user-device.model";
import UserProfileImage from "../../models/users-model/user-profile-image/user-profile-image.model";
import UserRole from "../../models/users-model/user-role/user-role.model";
import { generateToken } from "../../utils/Token/Token.Util";
import { generateRandomPassword } from "../../utils/generate-password/generate-password.util";
import { TUserRoleInterface } from "../../models/users-model/user-role/TType";
import UserOrganizationDetails from "../../models/users-model/user-organization-details/user-organization-details.model";
import { TUserOrganizationDetailsInterface } from "../../models/users-model/user-organization-details/TType";

// Super-admin registration
export const superAdminRegistration: RequestHandler = async (
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
        Message: "Missing field!!!",
      });
    }
    const user = await UserCredential.findOne({
      userEmailAddress: userEmailAddress,
    });
    if (user) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "User already exist!!!",
      });
    }
    const newUserObject = new UserCredential({
      userEmailAddress: userEmailAddress,
      userPassword: userPassword,
      accountActivated: true,
    });
    const registeredUser = await newUserObject.save();
    if (!registeredUser) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong!!!",
      });
    }
    const userdetails = new UserDetails({
      userId: registeredUser._id,
    });
    const userdevice = new UserDevice({
      userId: registeredUser._id,
    });
    const userorganization = new UserOrganizationDetails({
      userId: registeredUser._id,
    });
    const userprofileimage = new UserProfileImage({
      userId: registeredUser._id,
    });
    const userrole = new UserRole({
      userId: registeredUser._id,
      isSuperAdmin: true,
    });
    const savedata = await Promise.all([
      userdetails.save(),
      userdevice.save(),
      userorganization.save(),
      userprofileimage.save(),
      userrole.save(),
    ]);
    if (!savedata) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong!!!",
      });
    }
    return res.json({
      Type: "Success",
      Success: true,
      Status: 201,
      Message: "Registered successful!!!",
      Data: generateToken(String(registeredUser._id)),
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

// Add admin user
export const addUser: RequestHandler = async (req: Request, res: Response) => {
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
    const { userEmailAddress } = req.body as TUserCredentialInterface;
    const { isSuperAdmin, isAdmin, isTeacher, isStudent } =
      req.body as TUserRoleInterface;
    const {
      userDepartment,
      userDesignation,
      userJoiningYear,
      userOrganizationName,
    } = req.body as TUserOrganizationDetailsInterface;
    if (userEmailAddress) {
      const user = await UserCredential.findOne({
        userEmailAddress: userEmailAddress,
      });
      if (user) {
        return res.json({
          Type: "Success",
          Success: false,
          Status: 403,
          Message: "User already exist!!!",
        });
      }
      const newAdmin = new UserCredential({
        userEmailAddress: userEmailAddress,
        userPassword: await generateRandomPassword(8),
        accountActivated: true,
      });
      const registeredUser = await newAdmin.save();
      if (!registeredUser) {
        return null;
      }
      const userdetails = new UserDetails({
        userId: registeredUser._id,
      });
      const userdevice = new UserDevice({
        userId: registeredUser._id,
      });
      const userorganization = new UserOrganizationDetails({
        userId: registeredUser._id,
        userUniqueId: "",
        userDepartment: userDepartment,
        userDesignation: userDesignation,
        userJoiningYear: userJoiningYear,
        userOrganizationName: userOrganizationName,
      });
      const userprofileimage = new UserProfileImage({
        userId: registeredUser._id,
      });
      const userrole = new UserRole({
        userId: registeredUser._id,
        isSuperAdmin: isSuperAdmin ? isSuperAdmin : undefined,
        isAdmin: isAdmin ? isAdmin : undefined,
        isTeacher: isTeacher ? isTeacher : undefined,
        isStudent: isStudent ? isStudent : undefined,
      });
      const savedata = await Promise.all([
        userdetails.save(),
        userdevice.save(),
        userorganization.save(),
        userprofileimage.save(),
        userrole.save(),
      ]);
      if (!savedata) {
        return res.json({
          Type: "Success",
          Success: false,
          Status: 403,
          Message: "Something went wrong!!!",
        });
      }
      return res.json({
        Type: "Success",
        Success: true,
        Status: 201,
        Message: "User added successful!!!",
      });
    }
  } catch (error) {
    return res.json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
      error: error,
    });
  }
};

// Get all admin users by organization

// Get all teacher users by organization

// Get all student users by organization

// Get users details

// Update users details

// Delete user
