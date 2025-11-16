import { Request, Response } from "express";
import authService from "./services";

const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const response = await authService.loginUser(email, password);
      res.status(200).json(response);
    } catch (error: any) {
      console.error("Login Error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      const newUser = await authService.registerUser(payload);
      res.status(201).json(newUser);
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Internal Server Error" });
    }
  },
  changeRole: async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      const newUser = await authService.changeRole(payload);
      res.status(201).json(newUser);
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Internal Server Error" });
    }
  },
};

export default authController;
