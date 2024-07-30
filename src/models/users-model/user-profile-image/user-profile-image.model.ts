import mongoose, { Model } from "mongoose";
import { TUserProfileImageInterface } from "./TType";

type UserProfileImageType = TUserProfileImageInterface & mongoose.Document;

const UserProfileImageSchema = new mongoose.Schema(
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
    profileImage: [
      {
        imagePath: {
          type: String,
          required: false,
          default: null,
        },
        status: {
          type: Boolean,
          required: false,
          default: false,
        },
        timeStamps: {
          type: Date,
          required: false,
          default: Date.now(),
        },
      },
    ],
    timeStamps: {
      type: Date,
      required: false,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const UserProfileImage: Model<UserProfileImageType> =
  mongoose.model<UserProfileImageType>(
    "UserProfileImage",
    UserProfileImageSchema
  );

export default UserProfileImage;
