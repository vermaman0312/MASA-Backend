import speakeasy from "speakeasy";
import { decodeToken } from "../Token/Token.Util";
import { OtpPathUrlType } from "./Model/Otp.DataType";
import EmployeeDetails from "../../models/users-model/employee-details/employee-details/employee-details.model";
import StudentDetails from "../../models/users-model/student-details/student-details/student-details-model";
import UserRole from "../../models/users-model/user-role/user-role.model";

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
  const seprateToken = token.split(" ")[1];
  const loggedInUser = await decodeToken(token as string);
  if (!loggedInUser) {
    return "Invalid token";
  }

  const userRole = await UserRole.findOne({ userId: loggedInUser.userId });

  const employeeDetails = await EmployeeDetails.findOne({
    userId: loggedInUser.userId,
  });
  const studentDetails = await StudentDetails.findOne({
    userId: loggedInUser.userId,
  });

  const otpAuthUrl = speakeasy.otpauthURL({
    secret: seprateToken,
    label: userRole?.isStudent
      ? `${studentDetails?.userFirstName} ${studentDetails?.userLastName}`
      : `${employeeDetails?.userFirstName} ${employeeDetails?.userLastName}`,
    issuer: "Management and  Strategic Automation System",
  });
  return { URL: otpAuthUrl, secret: secret.base32 };
}

export function verify2FAOtp(secret: string, otp: string) {
  const token = secret.split(" ")[1];
  const verified = speakeasy.totp.verify({
    secret: token,
    encoding: "ascii",
    token: otp,
    window: 1,
  });
  return verified;
}
