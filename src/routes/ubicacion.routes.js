import { Router } from "express";
import { 
    crearUbicacion, 
    deleteUbicacion, 
    getUbicacion, 
    getUbicaciones,
    updateUbicacion,
} from "../controllers/ubicacion.controller.js";


const router = Router();

router.post("/crearUbicacion", crearUbicacion);
router.get("/obtenerUbicaciones", getUbicaciones);
router.delete("/eliminarUbicacion/:id", deleteUbicacion);
router.put("/editarUbicacion/:id", updateUbicacion);
router.get("/obtenerUbicacion/:id", getUbicacion);

export default router;