import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export interface AuthRequest extends Request {
  user: string;
  file?: any;
}

import "dotenv/config";

const secretKey = process.env.SECRET_KEY || "";

export const authenticationMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        error: "Authorization is required",
      });
    }
    const token = authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "Invalid token format",
      });
    }
    const { _id } = jwt.verify(token, secretKey) as { _id: string };
    req.user = _id;
    next();
  } catch (error) {
    console.log("error in authenticationMiddleware", error);
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};
