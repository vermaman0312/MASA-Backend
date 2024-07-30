import multer, { Multer } from "multer";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { folderPath, storage } from "../../../custom-function/CustomFileUpload/CustomFileUpload";

// Define a type for the file object
interface UploadedFile extends Express.Multer.File { }

// Create multer upload instance
const upload: Multer = multer({ storage: storage });

// Custom profile image file upload middleware
const profileImageFileUpload = (req: Request, res: Response, next: NextFunction) => {
    folderPath("profileImage");
    upload.array("profileImage", 10)(req, res, (err: unknown) => {
        if (err) {
            return res.status(400).json({ error: (err as Error).message });
        }
        const file: UploadedFile = req.file as UploadedFile;
        if (!file) {
            return res.status(400).json({ error: "No file provided" });
        }
        const allowedTypes: string[] = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize: number = 10 * 1024 * 1024;

        if (!allowedTypes.includes(file.mimetype)) {
            fs.unlinkSync(file.path);
            return res.status(400).json({ error: `Invalid file type: ${file.originalname}` });
        }

        if (file.size > maxSize) {
            fs.unlinkSync(file.path);
            return res.status(400).json({ error: `File too large: ${file.originalname}` });
        }

        next();
    });
};

export default profileImageFileUpload;