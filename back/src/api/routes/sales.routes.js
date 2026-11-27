import { Router } from "express";
import { postSale } from "../controllers/sales.controllers.js";

const router = Router();
router.post("/", postSale);

export default router;