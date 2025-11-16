import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { imagekit } from "../../config/imagekit";

// Multer with in-memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToImageKit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const base64File = req.file.buffer.toString("base64");

    const uploadedResponse = await imagekit.upload({
      file: base64File,
      fileName: `${Date.now()}-${req.file.originalname}`,
    });

    // Attach the uploaded file info to the request
    (req as any).fileInfo = {
      url: uploadedResponse.url,
      fileId: uploadedResponse.fileId,
    };

    next();
  } catch (error: any) {
    return res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
};
