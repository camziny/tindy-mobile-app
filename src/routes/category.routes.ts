import express from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
} from "../controllers/category.controller";
import { authenticationMiddleware } from "../middleware";

const categoryRoutes = express.Router();

categoryRoutes.use(authenticationMiddleware);

categoryRoutes.route("/").get(getAllCategories);
categoryRoutes.route("/create").post(createCategory);
categoryRoutes.route("/:id").get(getCategoryById);
categoryRoutes.route("/:id").delete(deleteCategory);
categoryRoutes.route("/update").put(updateCategory);

export default categoryRoutes;
