import speakeasy from "speakeasy";
import { decodeToken } from "../Token/Token.Util";
import { OtpPathUrlType } from "./Model/Otp.DataType";
import EmployeeDetails from "../../models/users-model/employee-details/employee-details/employee-details.model";
import StudentDetails from "../../models/users-model/student-details/student-details/student-details-model";
import UserRole from "../../models/users-model/user-role/user-role.model";
import UserPrivacy from "../../models/users-model/user-privacy/user-privacy.model";

const secret = speakeasy.generateSecret({ length: 20 });

export const generateOtp = function generateOtp() {
  const otp = speakeasy.totp({
    secret: secret.base32 as string,
    encoding: "base32",
    digits: 6,
    step: 30,
  });
  return otp;
};

export function validateOTP(otp: string) {
  return speakeasy.totp.verify({
    secret: secret.base32 as string,
    encoding: "base32",
    token: otp,
    step: 30,
    window: 1,
  });
}

export async function generateOtpPathUrl(
  token: string
): Promise<OtpPathUrlType | string> {
  try {
    const loggedInUser = await decodeToken(token);
    if (!loggedInUser) {
      return "Invalid token";
    }
    const userRole = await UserRole.findOne({ userId: loggedInUser.userId });
    const userPrivacy = await UserPrivacy.findOne({
      userId: loggedInUser.userId,
    });
    let userPrivacyDetails;

    if (!userPrivacy?.user2FAKey) {
      userPrivacyDetails = await UserPrivacy.findOneAndUpdate(
        { userId: loggedInUser.userId },
        {
          user2FAKey: secret.base32,
        }
      );
    }

    const employeeDetails = await EmployeeDetails.findOne({
      userId: loggedInUser.userId,
    });
    const studentDetails = await StudentDetails.findOne({
      userId: loggedInUser.userId,
    });

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: userPrivacy?.user2FAKey
        ? (userPrivacy.user2FAKey as string)
        : (userPrivacyDetails?.user2FAKey as string),
      label: userRole?.isStudent
        ? `${studentDetails?.userFirstName} ${studentDetails?.userLastName}`
        : `${employeeDetails?.userFirstName} ${employeeDetails?.userLastName}`,
      issuer: "Management and Strategic Automation System",
    });

    return {
      URL: otpAuthUrl,
      secret: userPrivacy?.user2FAKey
        ? (userPrivacy.user2FAKey as string)
        : (userPrivacyDetails?.user2FAKey as string),
    };
  } catch (error) {
    console.log("error path url", error);
    return "Internal server error";
  }
}

export async function verify2FAOtp(
  secret: string,
  otp: string
): Promise<boolean> {
  try {
    const loggedInUser = await decodeToken(secret);
    if (!loggedInUser) {
      throw new Error("Invalid token");
    }

    const userPrivacy = await UserPrivacy.findOne({
      userId: loggedInUser.userId,
    });
    if (!userPrivacy) {
      throw new Error("User secret not found");
    }
    const verified = speakeasy.totp.verify({
      secret: userPrivacy.user2FAKey,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    console.log("verifyed", verified);

    return verified;
  } catch (error) {
    // Propagate the error to be handled by the calling function
    console.log("error verify otp", error);
    throw new Error("Internal server error");
  }
}
