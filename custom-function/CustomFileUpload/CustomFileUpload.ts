import multer from "multer";
import path from "path";
import { Request } from "express";
import { generateRandomString } from "./GenerateRandomString";

export const folderPath = (path: string): string => {
    if (path === "profileImage") {
        return "UploadedFiles/Profile";
    } else if (path === "status") {
        return "UploadedFiles/Profile";
    } else if (path === "post") {
        return "UploadedFiles/Profile";
    } else {
        return '';
    }
}

// Configure multer storage and file name
export const storage: multer.StorageEngine = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) => {
        cb(null, `${folderPath}`);
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) => {
        const randomString = generateRandomString(12);
        const fileExtension = path.extname(file.originalname);
        const randomFilename = randomString + fileExtension;
        cb(null, randomFilename);
    },
});