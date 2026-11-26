/*=====================
    Rutas vistas
=====================*/
import { Router } from "express";
import { vistaPrincipal } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";
const router = Router();


router.get("/principal", requireLogin, vistaPrincipal);


export default router;