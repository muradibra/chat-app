import jwt from "jsonwebtoken";
import User from "../mongoose/schemas/user.model";
import { Request, Response, NextFunction } from "express";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded || typeof decoded === "string") {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return;
    }

    const user = await User.findById((decoded as jwt.JwtPayload).userId).select(
      "-password"
    );

    if (!user) {
      res.status(401).json({ message: "Unauthorized- User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
