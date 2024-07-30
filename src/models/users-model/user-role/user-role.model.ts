import mongoose, { Model } from "mongoose";
import { TUserRoleInterface } from "./TType";

type UserRoleType = TUserRoleInterface & mongoose.Document;

const UserRoleSchema = new mongoose.Schema(
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
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    isStudent: {
      type: Boolean,
      required: false,
      default: false,
    },
    isEmployee: {
      type: Boolean,
      required: false,
      default: false,
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

const UserRole: Model<UserRoleType> = mongoose.model<UserRoleType>(
  "userRole",
  UserRoleSchema
);

export default UserRole;
