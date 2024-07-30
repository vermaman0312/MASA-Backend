import { ObjectId } from "mongoose";

export interface TEmployeeDetailsInterface {
  userId: ObjectId;
  userUniqueId: string;
  userFirstName: string | null;
  userLastName: string | null;
  userGender: string | null;
  userDateOfBirth: Date | null;
  userAddress1: string | null;
  userAddress2: string | null;
  userCountry: string | null;
  userState: string | null;
  userPinCode: string | null;
  userDocuments: Array<string> | null;
  timeStamps: Date;
}
