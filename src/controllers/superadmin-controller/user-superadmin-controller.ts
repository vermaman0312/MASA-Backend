import { Request, RequestHandler, Response } from "express";
import { TUserCredentialInterface } from "../../models/users-model/user-credential/TType";
import UserCredential from "../../models/users-model/user-credential/user-credential.model";
import UserDevice from "../../models/users-model/user-device/user-device.model";
import UserProfileImage from "../../models/users-model/user-profile-image/user-profile-image.model";
import UserRole from "../../models/users-model/user-role/user-role.model";
import { decodeToken, generateToken } from "../../utils/Token/Token.Util";
import EmployeeDetails from "../../models/users-model/employee-details/employee-details/employee-details.model";
import EmployeeOfficialDetails from "../../models/users-model/employee-details/employee-official-details/employee-official-details.model";
import { generateUniqueId } from "../../utils/generate-unique-id/generate-unique-id";
import { TEmployeeDetailsInterface } from "../../models/users-model/employee-details/employee-details/TType";
import { TEmployeeOfficialDetailInterface } from "../../models/users-model/employee-details/employee-official-details/TType";
import { generateRandomPassword } from "../../utils/generate-password/generate-password.util";

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
      userUniqueId: await generateUniqueId("isAdmin", "RK"),
      userEmailAddress: userEmailAddress,
      userPassword: userPassword,
      userCountryCode: null,
      userPhoneNumber: null,
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
    const userdetails = new EmployeeDetails({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const userdevice = new UserDevice({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const userorganization = new EmployeeOfficialDetails({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const userprofileimage = new UserProfileImage({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const userrole = new UserRole({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
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

// Add Employee registration
export const addEmployeeRegistration: RequestHandler = async (
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
    if (!loggedInUser?.isSuperAdmin) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Unauthorized access!!!",
      });
    }
    const { userEmailAddress, userCountryCode, userPhoneNumber } =
      req.body as TUserCredentialInterface;
    const {
      userFirstName,
      userLastName,
      userGender,
      userDateOfBirth,
      userAddress1,
      userAddress2,
      userCountry,
      userState,
      userPinCode,
    } = req.body as TEmployeeDetailsInterface;
    const { userDepartment, userDesignation, userJoiningDate } =
      req.body as TEmployeeOfficialDetailInterface;
    if (
      !userEmailAddress ||
      !userCountryCode ||
      !userPhoneNumber ||
      !userFirstName ||
      !userLastName ||
      !userGender ||
      !userDateOfBirth ||
      !userAddress1 ||
      !userAddress2 ||
      !userCountry ||
      !userState ||
      !userPinCode ||
      !userDepartment ||
      !userDesignation ||
      !userJoiningDate
    ) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing field!!!",
      });
    }
    const existingUser = await UserCredential.findOne({
      userEmailAddress: userEmailAddress,
    });
    if (existingUser) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "User already exist!!!",
      });
    }
    const newCredential = new UserCredential({
      userUniqueId: await generateUniqueId("isAdmin", userDepartment),
      userEmailAddress: userEmailAddress,
      userPassword: await generateRandomPassword(8),
      userCountryCode: userCountryCode,
      userPhoneNumber: userPhoneNumber,
      accountActivated: true,
    });
    const registeredEmployee = await newCredential.save();
    if (!registeredEmployee) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong!!!",
      });
    }
    const registeredEmployeeDetails = new EmployeeDetails({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
      userFirstName: userFirstName,
      userLastName: userLastName,
      userGender: userGender,
      userDateOfBirth: userDateOfBirth,
      userAddress1: userAddress1,
      userAddress2: userAddress2,
      userCountry: userCountry,
      userState: userState,
      userPinCode: userPinCode,
    });
    const registeredEmployeeOfficialDetails = new EmployeeOfficialDetails({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
      userDepartment: userDepartment,
      userDesignation: userDesignation,
      userJoiningDate: userJoiningDate,
    });
    const registeredEmployeeDeviceDetails = new UserDevice({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
    });
    const registeredEmployeeProfileImageDetails = new UserProfileImage({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
    });
    const registeredEmployeeRoleDetails = new UserRole({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
      isEmployee: true,
    });

    await Promise.all([
      registeredEmployeeDetails.save(),
      registeredEmployeeOfficialDetails.save(),
      registeredEmployeeDeviceDetails.save(),
      registeredEmployeeProfileImageDetails.save(),
      registeredEmployeeRoleDetails.save(),
    ]);
    return res.json({
      Type: "Success",
      Success: true,
      Status: 201,
      Message: "Registered successful!!!",
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

// Add Student registration

