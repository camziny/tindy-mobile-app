import express from "express";
import { authenticationMiddleware } from "../middleware";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getAllProductsByCategory,
} from "../controllers/product.controller";
import multer from "multer";
import { AuthRequest } from "../middleware";

const productRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

productRoutes.use(authenticationMiddleware);

productRoutes.route("/").get(getAllProducts);
productRoutes
  .route("/products-by-categories/:id")
  .get(getAllProductsByCategory);
productRoutes.route("/create").post(upload.single("image"), createProduct);
productRoutes.route("/:id").delete(deleteProduct);
productRoutes.route("/edit/:id").put(editProduct);

export default productRoutes;
