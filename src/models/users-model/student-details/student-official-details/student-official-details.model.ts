import mongoose, { Model } from "mongoose";
import { TStudetOfficialDetailsInterface } from "./TType";

type StudentOfficialDetailsType = TStudetOfficialDetailsInterface &
  mongoose.Document;

const StudentOfficialDetailsSchema = new mongoose.Schema(
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
    userDepartment: {
      type: String,
      required: false,
      default: null,
    },
    userBranch: {
      type: String,
      required: false,
      default: null,
    },
    userFaculty: {
      type: String,
      required: false,
      default: null,
    },
    userAdmissionDate: {
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

const StudentOfficialDetails: Model<StudentOfficialDetailsType> =
  mongoose.model<StudentOfficialDetailsType>(
    "StudentOfficialDetails",
    StudentOfficialDetailsSchema
  );

export default StudentOfficialDetails;
