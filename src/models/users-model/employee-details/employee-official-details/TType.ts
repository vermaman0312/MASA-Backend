import { ObjectId } from "mongoose";

export interface TEmployeeOfficialDetailInterface {
  userId: ObjectId;
  userUniqueId: string;
  userDepartment: string;
  userDesignation: string;
  userJoiningDate: Date;
  timeStamps: Date;
}
