import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { TUserCredentialInterface } from "./TType";

dotenv.config();
type UserCredentialType = TUserCredentialInterface & mongoose.Document;

const UserCredentialSchema = new mongoose.Schema(
  {
    userUniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    userEmailAddress: {
      type: String,
      required: false,
      default: null,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid Email address",
      ],
    },
    userPassword: {
      type: String,
      required: true,
      unique: true,
    },
    userCountryCode: {
      type: Number,
      required: false,
      default: null,
    },
    userPhoneNumber: {
      type: Number,
      required: false,
      default: null,
    },
    accountActivated: {
      type: Boolean,
      required: false,
      default: false,
    },
    accountDeleted: {
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

UserCredentialSchema.pre("save", async function (next) {
  if (!this.isModified("userPassword")) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(this.userPassword, salt);

  this.userPassword = hash;

  next();
});

UserCredentialSchema.methods.comparePassword = function (
  entredPassword: string
) {
  const user = this as TUserCredentialInterface;
  return bcrypt.compareSync(entredPassword, user.userPassword);
};

const UserCredential = mongoose.model<UserCredentialType>(
  "UserCredential",
  UserCredentialSchema
);

export default UserCredential;
