import express, { Request, Response } from "express";
import connectToDataBase from "./db";
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cors from "cors";
import { Storage } from "@google-cloud/storage";

import "dotenv/config";

const app = express();
app.use(cors());

app.use(express.json());

const PORT = 3000;

connectToDataBase();

app.get("/", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:19006"); // Set appropriate origin
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.send("hello world");
});

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log("server running");
});
