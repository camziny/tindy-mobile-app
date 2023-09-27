import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { Types } from "mongoose";
import User from "../models/user";
import { IUser } from "../types";
import "dotenv/config";

export const getUserToken = (_id: string | Types.ObjectId) => {
  const authenticatedUserToken = jwt.sign(
    { _id },
    process.env.SECRET_KEY as Secret,
    {
      expiresIn: "7d",
    }
  );
  return authenticatedUserToken;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("user already exists");
    }

    const saltRounds = 12;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.log("error in createUser", error);
    throw error;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: IUser = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(409).send({ message: "User doesn't exist" });
    }
    const isPasswordIdentical = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordIdentical) {
      const token = getUserToken(existingUser._id);
      return res.send({
        token,
        user: {
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    } else {
      return res.status(400).send({ message: "Incorrect credentials" });
    }
  } catch (error) {
    console.log("error in loginUser", error);
    throw error;
  }
};
