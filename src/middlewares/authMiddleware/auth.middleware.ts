// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "Authorization header missing" });
//   }

//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Token missing" });
//   }

//   try {
//     const secretKey = process.env.JWT_SECRET || "your_secret_key";
//     const decoded = jwt.verify(token, secretKey);
//     (req as any).user = decoded; // Attach decoded token to request object
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// export default authMiddleware;

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate JWT Token
 */
export const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

/**
 * Middleware to verify and authorize JWT token
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      (req as any).user = decoded; // attach decoded data to request
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  return res.status(401).json({ message: "Not authorized, token missing" });
};

/**
 * Middleware to restrict route access by role
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    next();
  };
};
