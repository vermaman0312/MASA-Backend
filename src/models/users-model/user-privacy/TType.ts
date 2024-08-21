import { ObjectId } from "mongoose";

export type TUser2FAMethodType = {
  userAuthenticatorApp: boolean;
  userTextSMS: boolean;
};

export interface TUserPrivacyInterface {
  userId: ObjectId;
  userUniqueId: string;
  userIs2FA: boolean;
  userIs2FASetupCompleted: boolean;
  userOTP: string;
  userPassKey: string;
  userPreffered2FAApp: string;
  user2FAMethod: TUser2FAMethodType;
  userSecurityKey: string;
  userRecoveryCode: string;
  timeStamps: Date;
}
