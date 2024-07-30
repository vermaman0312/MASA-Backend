import { Request, Response, NextFunction } from "express";

const notFound = async (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({ success: false, message: (err as Error).message });
};

export { notFound, errorHandler };
