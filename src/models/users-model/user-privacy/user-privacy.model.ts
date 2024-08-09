import mongoose, { Model } from "mongoose";
import { TUserPrivacyInterface } from "./TType";

type UserPrivacyType = TUserPrivacyInterface & mongoose.Document;

const UserPrivacySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserCredential",
    },
    userUniqueId: {
      type: String,
      required: true,
    },
    userIs2FA: {
      type: Boolean,
      required: false,
      default: false,
    },
    userOTP: {
      type: String,
      required: false,
      default: null,
    },
    userPassKey: {
      type: Array<string>,
      required: false,
      default: null,
    },
    userPreffered2FAApp: {
      type: String,
      required: false,
      enum: [
        "Google authenticator app",
        "Microsoft authenticator app",
        "SMS/Text",
      ],
      default: "Google authenticator app",
    },
    user2FAMethod: {
      type: [String],
      required: false,
      enum: [
        "userRecoveryCode",
        "userSecurityKey",
        "userPassKey",
        "authenticator app",
        "SMS/Text",
      ],
      default: null,
    },
    userSecurityKey: {
      type: String,
      required: false,
      default: null,
    },
    userRecoveryCode: {
      type: String,
      required: false,
      default: null,
    },
    timeStamps: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserPrivacy: Model<UserPrivacyType> = mongoose.model<UserPrivacyType>(
  "UserPrivacy",
  UserPrivacySchema
);

export default UserPrivacy;