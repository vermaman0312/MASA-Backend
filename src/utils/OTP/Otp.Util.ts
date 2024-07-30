import speakeasy from "speakeasy";
import { decodeToken } from "../Token/Token.Util";
import { OtpPathUrlType } from "./Model/Otp.DataType";
import UserDetails from "../../models/users-model/user-details/user-details.model";

const secret = speakeasy.generateSecret({ length: 20 });

export const generateOtp = function generateOtp() {
    const otp = speakeasy.totp({
        secret: secret.base32 as string,
        encoding: 'base32',
        digits: 6,
        step: 30,
    });
    return otp;
}

export function validateOTP(otp: string) {
    return speakeasy.totp.verify({
        secret: secret.base32 as string,
        encoding: 'base32',
        token: otp,
        step: 30,
        window: 1,
    });
}

export async function generateOtpPathUrl(token: string): Promise<OtpPathUrlType | string> {
    const seprateToken = token.split(' ')[1];
    const loggedInUserId = decodeToken(
        seprateToken as string
    );
    if (!loggedInUserId) {
        return "Invalid token"
    }
    const userDetails = await UserDetails.findOne({ userId: loggedInUserId });
    const otpAuthUrl = speakeasy.otpauthURL({
        secret: seprateToken,
        label: `${userDetails?.userFirstName} ${userDetails?.userLastName}`,
        issuer: 'Versa',
    });
    return { URL: otpAuthUrl, secret: seprateToken };
}

export function verify2FAOtp(secret: string, otp: string) {
    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'ascii',
        token: otp,
        window: 1,
    });
    return verified;
}