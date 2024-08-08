import { ObjectId } from "mongoose";

export interface TUserPrivacyInterface {
  userId: ObjectId;
  userUniqueId: string;
  userIs2FA: boolean;
  userOTP: string;
  userPassKey: Array<string>;
  userPreffered2FAApp: string;
  user2FAMethod: Array<string>;
  userSecurityKey: string;
  userRecoveryCode: string;
  timeStamps: Date;
}
