import { Request, Response } from "express";
import { AuthRequest } from "../middleware";
import Product from "../models/product";
import { IProduct } from "../types";
import { Storage } from "@google-cloud/storage";
import path from "path";

const keyFilePath = path.join(
  __dirname,
  "..",
  "..",
  "keys",
  "tindy-app-7625844ab921.json"
);

const storage = new Storage({
  projectId: "tindy-app",
  keyFilename: keyFilePath,
});
const bucketName = "tindy-app-bucket";
const bucket = storage.bucket(bucketName);

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const products = await Product.find({
      user: userId,
    });
    res.send(products);
  } catch (error) {
    console.log("error in getAllProducts", error);
    res.send({ error: "Error while fetching products " });
    throw error;
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const { name, price, categoryId }: IProduct = req.body;

    console.log("Received request with headers:", req.headers);

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    console.log("Received image file:", req.file);

    const imageFileName = `product_images/${Date.now()}-${
      req.file.originalname
    }`;
    const imageFile = bucket.file(imageFileName);
    await imageFile.save(req.file.buffer, { contentType: req.file.mimetype });
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${imageFileName}`;
    const product = await Product.create({
      name,
      price,
      image: publicUrl,
      categoryId,
      user: userId,
    });
    res.send(product);
  } catch (error) {
    console.log("error in createProduct", error);
    res.send({ error: "Error while creating product" });
    throw error;
  }
};

export const getAllProductsByCategory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const products = await Product.find({
      user: userId,
      categoryId: id,
    });
    const transformedProducts = products.map((product) => {
      const transformedProduct: any = product.toObject();
      if (transformedProduct.image && transformedProduct.image.data) {
        transformedProduct.imageBase64 = `data:${
          transformedProduct.image.contentType
        };base64,${transformedProduct.image.data.toString("base64")}`;
      }
      return transformedProduct;
    });
    res.send(transformedProducts);
  } catch (error) {
    console.log("Error in getAllProductsByCategory", error);
    res.send({ error: "Error while fetching products" });
    throw error;
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Product.deleteOne({
      _id: id,
    });
    res.send({ message: "Product deleted" });
  } catch (error) {
    console.log("Error in deleteProduct", error);
    res.send({ error: "Error while deleting product" });
    throw error;
  }
};

export const editProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { _id, categoryId, name, price, image }: IProduct = req.body;
    await Product.updateOne(
      {
        _id,
      },
      {
        $set: {
          name,
          categoryId,
          price,
          image,
        },
      }
    );
  } catch (error) {
    console.log("Error in editProduct");
    res.send({ error: "Error while editing product" });
    throw error;
  }
};
