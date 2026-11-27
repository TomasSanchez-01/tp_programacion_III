/*=====================
    Rutas vistas
=====================*/
import { Router } from "express";
import { vistaCrear, vistaPrincipal } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";
const router = Router();


router.get("/principal", requireLogin, vistaPrincipal);

router.get("/crear", requireLogin, vistaCrear);


export default router;