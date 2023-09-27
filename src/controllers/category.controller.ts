import Category from "../models/category";
import express, { Request, Response } from "express";
import { ICategory } from "../types";
import { AuthRequest } from "../middleware";
import Product from "../models/product";
import { Storage } from "@google-cloud/storage";

export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    const categories = await Category.find({
      user: user,
    });
    return res.send(categories);
  } catch (error) {
    console.log("error in getAllCategories", error);
    throw error;
  }
};

export const getCategoryById = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { user } = request;
    const { id } = request.params;
    const category = await Category.findOne({
      _id: id,
    });
    const categoryWithId = {
      ...category.toObject(),
      id: category._id,
    };

    return response.send(categoryWithId);
  } catch (error) {
    response.send({ error: "Something went wrong" });
    console.log("error in getAllCategories", error);
    throw error;
  }
};

const storage = new Storage({
  keyFilename: "path-to-your-service-account-key.json",
});

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { color, icon, isEditable, name }: ICategory = req.body;
    const { user } = req;

    const category = await Category.create({
      color,
      icon,
      isEditable,
      name,
      user,
    });
    res.send(category);
  } catch (error) {
    console.log("error in createCategory", error);
    res.send({ error: "something went wrong creating category" });
    throw error;
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Category.deleteOne({ _id: id });
    res.send({ message: "Category deleted" });
  } catch (error) {
    console.log("error in deleteCategory", error);
    res.send({ error: "Unable to delete" });
    throw error;
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { _id, color, icon, isEditable, name }: ICategory = req.body;
    await Category.updateOne(
      {
        _id,
      },
      {
        $set: {
          name,
          color,
          icon,
          isEditable,
        },
      }
    );
    res.send({ message: "Category updated successfully" });
  } catch (error) {
    console.log("error in updateCategory", error);
    res.send({ error: "Error updating category " });
    throw error;
  }
};
