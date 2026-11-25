import {Router} from "express";
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { removeProduct, getAllProducts, getProductsById, createProduct, putProduct } from "../controllers/product.controllers.js";
const router = Router();

// GET all products
router.get("/", getAllProducts);

// GET product by id
router.get("/:id",validateId, getProductsById);

// DELETE product
router.delete("/:id", validateId, removeProduct);

// PUT product
router.put("/", validateProduct, putProduct);

// POST product
router.post("/", validateProduct, createProduct);

export default router;