import mongoose, { Model } from "mongoose";
import { TStudentDetailsInterface } from "./TType";

type StudentDetailsType = TStudentDetailsInterface & mongoose.Document;

const StudentDetailsSchema = new mongoose.Schema(
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
    userFatherName: {
      type: String,
      required: false,
      default: null,
    },
    userMotherName: {
      type: String,
      required: false,
      default: null,
    },
    userFatherOccupation: {
      type: String,
      required: false,
      default: null,
    },
    userMotherOccupation: {
      type: String,
      required: false,
      default: null,
    },
    userLocalGuardianName: {
      type: String,
      required: false,
      default: null,
    },
    userBloodGroup: {
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

const StudentDetails: Model<StudentDetailsType> =
  mongoose.model<StudentDetailsType>("StudentDetails", StudentDetailsSchema);

export default StudentDetails;
