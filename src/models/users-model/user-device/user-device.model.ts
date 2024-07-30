import mongoose, { Model } from "mongoose";
import { TUserDeviceInterface } from "./TType";

type UserDeviceType = TUserDeviceInterface & mongoose.Document;

const UserDeviceSchema = new mongoose.Schema(
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
    loggedInStatus: {
      type: String,
      required: false,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    browserName: {
      type: String,
      required: false,
      default: null,
    },
    browserVersion: {
      type: String,
      required: false,
      default: null,
    },
    browserId: {
      type: String,
      required: false,
      default: null,
    },
    browserOS: {
      type: String,
      required: false,
      default: null,
    },
    browserEngine: {
      type: String,
      required: false,
      default: null,
    },
    ipAddress: {
      type: String,
      required: false,
      default: null,
    },
    macAddress: {
      type: String,
      required: false,
      default: null,
    },
    location: [
      {
        logitude: {
          type: String,
          required: false,
          default: null,
        },
        latitude: {
          type: String,
          required: false,
          default: null,
        },
        status: {
          type: Boolean,
          required: false,
          default: false,
        },
      },
    ],
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

const UserDevice: Model<UserDeviceType> = mongoose.model<UserDeviceType>(
  "UserDevice",
  UserDeviceSchema
);

export default UserDevice;
