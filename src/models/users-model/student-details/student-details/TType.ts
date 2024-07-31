import { ObjectId } from "mongoose";

export interface TStudentDetailsInterface {
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
  userFatherName: string | null;
  userMotherName: string | null;
  userFatherOccupation: string | null;
  userMotherOccupation: string | null;
  userLocalGuardianName: string | null;
  userBloodGroup: string | null;
  timeStamps: Date;
}
