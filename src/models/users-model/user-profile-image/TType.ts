import { ObjectId } from "mongoose";

interface IProfileImageType {
  imagePath: string;
  status: boolean;
  timeStamps?: Date;
}

export interface TUserProfileImageInterface {
  userId: ObjectId;
  userUniqueId: string;
  profileImage: Array<IProfileImageType>;
  timeStamps?: Date;
}
