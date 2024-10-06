import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const formattedError = {
        message: err.message || "An error occurred",
        code: (err as any).statusCode || 500
    }

    res.status(formattedError.code).json({
        success: false,
        data: null,
        error: formattedError
    })
}