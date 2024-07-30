import mongoose, { Model } from "mongoose";
import { TEmployeeOfficialDetailInterface } from "./TType";

type EmployeeOfficialDetailsType = TEmployeeOfficialDetailInterface &
  mongoose.Document;

const EmployeeOfficialDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserCredential",
    },
    userDepartment: {
      type: String,
      required: false,
      default: null,
    },
    userDesignation: {
      type: String,
      required: false,
      default: null,
    },
    userJoiningDate: {
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

const EmployeeOfficialDetails: Model<EmployeeOfficialDetailsType> =
  mongoose.model<EmployeeOfficialDetailsType>(
    "EmployeeOfficialDetails",
    EmployeeOfficialDetailsSchema
  );

export default EmployeeOfficialDetails;
