import { ObjectId } from "mongoose";

export interface TStudetOfficialDetailsInterface {
  userId: ObjectId;
  userUniqueId: string;
  userDepartment: string | null;
  userBranch: string | null;
  userFaculty: string | null;
  userAdmissionDate: Date | null;
  timeStamps?: Date;
}
