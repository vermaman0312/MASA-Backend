import { ObjectId } from "mongoose";

interface ILocationType {
    longitude: string;
    latitude: string;
    status: boolean;
}

export interface TUserDeviceInterface {
    userId: ObjectId;
    userUniqueId: string;
    loggedInStatus: "active" | "inactive";
    browserName: string;
    browserVersion: string;
    browserId: string;
    browserOS: string;
    browserEngine: string;
    ipAddress: string;
    macAddress: string;
    location: Array<ILocationType>;
    timeStamps: Date;
}