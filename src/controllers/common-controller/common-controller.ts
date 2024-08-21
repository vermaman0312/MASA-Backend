import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import {
  TPasswordType,
  TUserCredentialInterface,
} from "../../models/users-model/user-credential/TType";
import UserCredential from "../../models/users-model/user-credential/user-credential.model";
import { decodeToken, generateToken } from "../../utils/Token/Token.Util";
import {
  ILocationType,
  TUserDeviceInterface,
} from "../../models/users-model/user-device/TType";
import UserDevice from "../../models/users-model/user-device/user-device.model";
import UserRole from "../../models/users-model/user-role/user-role.model";
import StudentDetails from "../../models/users-model/student-details/student-details/student-details-model";
import EmployeeDetails from "../../models/users-model/employee-details/employee-details/employee-details.model";
import UserPrivacy from "../../models/users-model/user-privacy/user-privacy.model";
import { TUserRoleInterface } from "../../models/users-model/user-role/TType";
import UserProfileImage from "../../models/users-model/user-profile-image/user-profile-image.model";
import EmployeeOfficialDetails from "../../models/users-model/employee-details/employee-official-details/employee-official-details.model";
import StudentOfficialDetails from "../../models/users-model/student-details/student-official-details/student-official-details.model";
import {
  TUser2FAMethodType,
  TUserPrivacyInterface,
} from "../../models/users-model/user-privacy/TType";
import { generateOtpPathUrl, verify2FAOtp } from "../../utils/OTP/Otp.Util";
import { OtpPathUrlType } from "../../utils/OTP/Model/Otp.DataType";
import QRCode from "qrcode";

// Get username via ip address
export const getUserNameViaIpAddress: RequestHandler = async (
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
    const { ipAddress } = req.body as TUserDeviceInterface;
    if (!ipAddress) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Invalid IP address!!!",
      });
    }
    const deviceDetails = await UserDevice.findOne({ ipAddress: ipAddress });
    if (!deviceDetails) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Device not found!!!",
      });
    }
    const userRole = await UserRole.findOne({ userId: deviceDetails.userId });
    const studentDetails = await StudentDetails.findOne({
      userId: deviceDetails.userId,
    });
    const employeeDetails = await EmployeeDetails.findOne({
      userId: deviceDetails.userId,
    });
    if (userRole?.isStudent) {
      return res.json({
        Type: "Success",
        Success: true,
        Status: 200,
        Message: "User details fetched successfully!!!",
        Data: {
          userFirstName: studentDetails?.userFirstName,
          userLastName: studentDetails?.userLastName,
        },
      });
    } else {
      return res.json({
        Type: "Success",
        Success: true,
        Status: 200,
        Message: "User details fetched successfully!!!",
        Data: {
          userFirstName: employeeDetails?.userFirstName,
          userLastName: employeeDetails?.userLastName,
        },
      });
    }
  } catch (error) {
    return res.json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

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

// Change password
export const userChangePassword: RequestHandler = async (
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
    if (!loggedInUser?.userId) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Unauthorized access!!!",
      });
    }
    const { userOldPassword, userNewPassword } = req.body as TPasswordType;
    if (!userOldPassword || !userNewPassword) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Invalid old password or new password!!!",
      });
    }
    if (userOldPassword === userNewPassword) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Old and new password cannot be same!!!",
      });
    }
    const userPassword = await UserCredential.findById(loggedInUser.userId);
    if (!userPassword) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "User not found!!!",
      });
    }
    const validPassword = await bcrypt.compare(
      userOldPassword,
      userPassword?.userPassword
    );
    if (!validPassword) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Invalid old password!!!",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(userNewPassword, salt);
    const updatedPassword = await UserCredential.findByIdAndUpdate(
      loggedInUser.userId,
      {
        userPassword: hashPassword,
      }
    );
    if (!updatedPassword) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Failed to update password!!!",
      });
    }
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Password changed successfully!!!",
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

// User details
export const userDetails: RequestHandler = async (
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
    if (!loggedInUser?.userId) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Unauthorized access!!!",
      });
    }
    const { userId } = req.body as TUserRoleInterface;
    const userIdToUse = userId || loggedInUser.userId;
    const userRole = await UserRole.findOne({ userId: userIdToUse });
    const userProfileImage = await UserProfileImage.findOne({
      userId: userIdToUse,
    });
    const userCredentials = await UserCredential.findOne({ _id: userIdToUse });
    const employeeDetails = await EmployeeDetails.findOne({
      userId: userIdToUse,
    });
    const employeeOfficialDetails = await EmployeeOfficialDetails.findOne({
      userId: userIdToUse,
    });
    const studentDetails = await StudentDetails.findOne({
      userId: userIdToUse,
    });
    const studentOfficialDetails = await StudentOfficialDetails.findOne({
      userId: userIdToUse,
    });

    const userDetailsObject = {
      userId: userRole?.userId,
      userUniqueId: userRole?.userUniqueId,
      userFirstName: userRole?.isStudent
        ? studentDetails?.userFirstName
        : employeeDetails?.userFirstName,
      userLastName: userRole?.isStudent
        ? studentDetails?.userLastName
        : employeeDetails?.userLastName,
      userProfileImage: userProfileImage?.profileImage.find(
        (filter) => filter.status
      ),
      userGender: userRole?.isStudent
        ? studentDetails?.userGender
        : employeeDetails?.userGender,
      userDateOfBirth: userRole?.isStudent
        ? studentDetails?.userDateOfBirth
        : employeeDetails?.userDateOfBirth,
      userAddress1: userRole?.isStudent
        ? studentDetails?.userAddress1
        : employeeDetails?.userAddress1,
      userAddress2: userRole?.isStudent
        ? studentDetails?.userAddress2
        : employeeDetails?.userAddress2,
      userCountry: userRole?.isStudent
        ? studentDetails?.userCountry
        : employeeDetails?.userCountry,
      userState: userRole?.isStudent
        ? studentDetails?.userState
        : employeeDetails?.userState,
      userPinCode: userRole?.isStudent
        ? studentDetails?.userPinCode
        : employeeDetails?.userPinCode,
      userDocuments: userRole?.isStudent
        ? studentDetails?.userDocuments
        : employeeDetails?.userDocuments,
      userFatherName: userRole?.isStudent
        ? studentDetails?.userFatherName
        : undefined,
      userMotherName: userRole?.isStudent
        ? studentDetails?.userMotherName
        : undefined,
      userFatherOccupation: userRole?.isStudent
        ? studentDetails?.userFatherOccupation
        : undefined,
      userMotherOccupation: userRole?.isStudent
        ? studentDetails?.userMotherOccupation
        : undefined,
      userLocalGuardianName: userRole?.isStudent
        ? studentDetails?.userLocalGuardianName
        : undefined,
      userBloodGroup: userRole?.isStudent
        ? studentDetails?.userBloodGroup
        : undefined,
      userEmailAddress: userCredentials?.userEmailAddress,
      userCountryCode: userCredentials?.userCountryCode,
      userPhoneNumber: userCredentials?.userPhoneNumber,
      userDepartment: userRole?.isStudent
        ? studentOfficialDetails?.userDepartment
        : employeeOfficialDetails?.userDepartment,
      userBranch: userRole?.isStudent
        ? studentOfficialDetails?.userBranch
        : undefined,
      userFaculty: userRole?.isStudent
        ? studentOfficialDetails?.userFaculty
        : undefined,
      userAddmissionDate: userRole?.isStudent
        ? studentOfficialDetails?.userAdmissionDate
        : undefined,
      userDesignation: !userRole?.isStudent
        ? employeeOfficialDetails?.userDesignation
        : undefined,
      userJoiningDate: !userRole?.isStudent
        ? employeeOfficialDetails?.userJoiningDate
        : undefined,
      userRole: userRole?.isAdmin
        ? "admin"
        : userRole?.isEmployee
          ? "employee"
          : userRole?.isSuperAdmin
            ? "superadmin"
            : "student",
    };

    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "User details fetched successfully!!!",
      Data: userDetailsObject,
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
    const userDetails2FA = await UserPrivacy.findOne({
      userId: loggedInUser?.userId,
    });
    if (!userDetails2FA?.userIs2FA) {
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
        timeStamps: new Date(),
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

// Get device details
export const getDeviceDetails: RequestHandler = async (
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
    const deviceDetails = await UserDevice.findOne({
      userId: loggedInUser?.userId,
    });
    if (!deviceDetails) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "User device details not found!!!",
      });
    }
    const deviceDetailsObject = {
      loggedInStatus: deviceDetails.loggedInStatus,
      browserName: deviceDetails.browserName,
      browserVersion: deviceDetails.browserVersion,
      browserId: deviceDetails.browserId,
      browserOS: deviceDetails.browserOS,
      browserEngine: deviceDetails.browserEngine,
      ipAddress: deviceDetails.ipAddress,
      macAddress: deviceDetails.macAddress,
      location: deviceDetails.location,
      timeStamps: deviceDetails.timeStamps,
    };
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "User device details fetched successfully!!!",
      Data: deviceDetailsObject,
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

// 2FA details
export const details2FA: RequestHandler = async (
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
    const userDetails2FA = await UserPrivacy.findOne({
      userId: loggedInUser?.userId,
    });
    if (!userDetails2FA) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "User 2FA details not found!!!",
      });
    }
    const details2FAObject = {
      user2FAId: userDetails2FA._id,
      userId: userDetails2FA.userId,
      userUniqueId: userDetails2FA.userUniqueId,
      userIs2FA: userDetails2FA.userIs2FA,
      userIs2FASetupCompleted: userDetails2FA.userIs2FASetupCompleted,
      userPassKey: userDetails2FA.userPassKey,
      userPreffered2FAApp: userDetails2FA.userPreffered2FAApp,
      user2FAMethod: userDetails2FA.user2FAMethod,
      userSecurityKey: userDetails2FA.userSecurityKey,
      userRecoveryCode: userDetails2FA.userRecoveryCode,
      timeStamps: userDetails2FA.timeStamps,
    };
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "User 2FA details fetched successfully!!!",
      Data: details2FAObject,
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

// Update preffered 2FA method
export const updatePreffered2FAMethod: RequestHandler = async (
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
    const { userPreffered2FAApp } = req.body as TUserPrivacyInterface;
    const userPrivacy = await UserPrivacy.findOneAndUpdate(
      {
        userId: loggedInUser?.userId,
      },
      {
        userPreffered2FAApp: userPreffered2FAApp,
      }
    );
    if (!userPrivacy) {
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
      Message: "Preffered 2FA method updated successfuly!!!",
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

// Add and remove 2FA paaskey
export const update2FAPasskey: RequestHandler = async (
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
    const { userPassKey } = req.body as TUserPrivacyInterface;
    const userPrivacy = await UserPrivacy.findOneAndUpdate(
      {
        userId: loggedInUser?.userId,
      },
      {
        userPassKey: userPassKey,
      }
    );
    if (!userPrivacy) {
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
      Message: "User 2FA passkey updated successfully!!!",
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

// Update 2FA (on and off)
export const update2FASwitch: RequestHandler = async (
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
    const { userIs2FA } = req.body as TUserPrivacyInterface;
    const userPrivacy = await UserPrivacy.findOneAndUpdate(
      {
        userId: loggedInUser?.userId,
      },
      {
        userIs2FA: userIs2FA,
      }
    );
    if (!userPrivacy) {
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
      Message: "User 2FA details updated successfully!!!",
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

// Update 2FA setup completed
export const update2FASetupCompleted: RequestHandler = async (
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
    const { userIs2FASetupCompleted } = req.body as TUserPrivacyInterface;
    const userPrivacy = await UserPrivacy.findOneAndUpdate(
      {
        userId: loggedInUser?.userId,
      },
      {
        userIs2FASetupCompleted: userIs2FASetupCompleted,
      }
    );
    if (!userPrivacy) {
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
      Message: "User 2FA setup completed updated successfully!!!",
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

// Update 2FA method authenticator app
export const update2FAMethodAuthenticatorApp: RequestHandler = async (
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
    const { userAuthenticatorApp } = req.body as TUser2FAMethodType;
    const userPrivacy = await UserPrivacy.findOneAndUpdate(
      {
        userId: loggedInUser?.userId,
      },
      {
        user2FAMethod: {
          userAuthenticatorApp: userAuthenticatorApp,
        },
      }
    );
    if (!userPrivacy) {
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
      Message: "User 2FA details updated successfully!!!",
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

// Update 2FA method Text/SMS
export const update2FAMethodTextSMS: RequestHandler = async (
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
    const { userTextSMS } = req.body as TUser2FAMethodType;
    const userPrivacy = await UserPrivacy.findOneAndUpdate(
      {
        userId: loggedInUser?.userId,
      },
      {
        user2FAMethod: {
          userTextSMS: userTextSMS,
        },
      }
    );
    if (!userPrivacy) {
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
      Message: "User 2FA details updated successfully!!!",
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

// Update 2FA method security keys
export const update2FAMethodSecurityKeys: RequestHandler = async (
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
    const { userSecurityKey } = req.body as TUserPrivacyInterface;
    const userPrivacy = await UserPrivacy.findOneAndUpdate(
      {
        userId: loggedInUser?.userId,
      },
      {
        userSecurityKey: userSecurityKey,
      }
    );
    if (!userPrivacy) {
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
      Message: "User 2FA details updated successfully!!!",
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

// Update 2FA method recovery codes
export const update2FAMethodRecoveryCodes: RequestHandler = async (
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
    const { userRecoveryCode } = req.body as TUserPrivacyInterface;
    const userPrivacy = await UserPrivacy.findOneAndUpdate(
      {
        userId: loggedInUser?.userId,
      },
      {
        userRecoveryCode: userRecoveryCode,
      }
    );
    if (!userPrivacy) {
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
      Message: "User 2FA details updated successfully!!!",
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

// 2FA QR Code generate
export const generate2FAQRCode: RequestHandler = async (
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
    const userPrivacy = await UserPrivacy.findOne({
      userId: loggedInUser?.userId,
    });
    if (!userPrivacy?.userIs2FA) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "Turn on the 2FA first!!!",
      });
    }
    const { URL, secret } = (await generateOtpPathUrl(
      authorizationData ?? ""
    )) as OtpPathUrlType;
    QRCode.toDataURL(URL, (err, dataUrl) => {
      if (err) {
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
        Status: 200,
        Message: "QR code generated successfully!!!",
        Data: {
          qrKey: secret,
          qrImage: dataUrl,
        },
      });
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

// Verify 2FA code
export const verify2FACode: RequestHandler = async (
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
    const { userOTP } = req.body as TUserPrivacyInterface;
    const verified = verify2FAOtp(authorizationData as string, userOTP);
    if (!verified) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Otp has been expired!!!",
      });
    }
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Otp verified successfully!!!",
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
