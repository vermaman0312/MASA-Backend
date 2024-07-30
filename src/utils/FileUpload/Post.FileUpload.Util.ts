import multer, { Multer } from "multer";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { folderPath, storage } from "../../../custom-function/CustomFileUpload/CustomFileUpload";

// Define a type for the file object
interface UploadedFile extends Express.Multer.File { }

// Create multer upload instance
const upload: Multer = multer({ storage: storage });

// Custom file upload middleware
const postsUploadFile = (req: Request, res: Response, next: NextFunction) => {
    folderPath("post");
    upload.array("files", 10)(req, res, (err: unknown) => {
        if (err) {
            return res.status(400).json({ error: (err as Error).message });
        }
        const files: UploadedFile[] = req.files as UploadedFile[];
        const errors: string[] = [];
        files.forEach((file) => {
            const allowedTypes: string[] = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/bmp",
                "video/mp4",
                "video/webm",
                "video/quicktime",
                "audio/mpeg",
                "audio/mp3",
                "audio/mp4a",
                "audio/wav",
                "audio/ogg",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/zip",
                "application/x-zip-compressed",
                "multipart/x-zip",
                "application/x-rar-compressed",
                "video/x-matroska",
                "audio/x-ms-wma",
                "audio/vnd.wave",
            ];

            const maxSize: number = 50 * 1024 * 1024;

            if (!allowedTypes.includes(file.mimetype)) {
                errors.push(`Invalid file type: ${file.originalname}`);
            }

            if (file.size > maxSize) {
                errors.push(`File too large: ${file.originalname}`);
            }
        });
        if (errors.length > 0) {
            files.forEach((file) => {
                fs.unlinkSync(file.path);
            });

            return res.status(400).json({ errors });
        }
        next();
    });
};

export default postsUploadFile;