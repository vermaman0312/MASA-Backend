import { ObjectId } from "mongoose";

export interface TUserRoleInterface {
    userId: ObjectId;
    userUniqueId: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isStudent: boolean;
    isTeacher: boolean;
    isNonTeacher: boolean;
    timeStamps: Date;
}