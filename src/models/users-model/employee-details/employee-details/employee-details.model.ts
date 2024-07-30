import mongoose, { Model } from "mongoose";
import { TEmployeeDetailsInterface } from "./TType";

type EmployeeDetailsType = TEmployeeDetailsInterface & mongoose.Document;

const EmployeeDetailsSchema = new mongoose.Schema(
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
    userFirstName: {
      type: String,
      required: false,
      default: null,
    },
    userLastName: {
      type: String,
      required: false,
      default: null,
    },
    userGender: {
      type: String,
      required: false,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    userDateOfBirth: {
      type: Date,
      required: false,
      default: null,
    },
    userAddress1: {
      type: String,
      required: false,
      default: null,
    },
    userAddress2: {
      type: String,
      required: false,
      default: null,
    },
    userCountry: {
      type: String,
      required: false,
      default: null,
    },
    userState: {
      type: String,
      required: false,
      default: null,
    },
    userPinCode: {
      type: String,
      required: false,
      default: null,
    },
    userDocuments: {
      type: Array,
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

const EmployeeDetails: Model<EmployeeDetailsType> =
  mongoose.model<EmployeeDetailsType>("EmployeeDetails", EmployeeDetailsSchema);

export default EmployeeDetails;
