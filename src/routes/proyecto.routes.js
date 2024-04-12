import { Router } from "express";
import {
  crearProyecto,
  getProyectos,
  deleteProyecto,
  getProyecto,
  updateProyecto,
  uploadImage,
} from "../controllers/proyecto.controller.js";
import multer from "multer";
import path from "path";

const router = Router();

// Configuración de Multer para manejar múltiples archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split().pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});

const upload = multer({ storage: storage });

router.post(
  "/crearProyecto",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "imagen1", maxCount: 1 },
    { name: "imagen2", maxCount: 1 },
    { name: "imagen3", maxCount: 1 },
  ]),
  crearProyecto
);
router.get("/obtenerProyectos", getProyectos);

router.delete("/eliminarProyecto/:id", deleteProyecto)

router.get("/proyecto/:id", getProyecto)
router.put(
  "/actualizarProyecto/:id",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "imagen1", maxCount: 1 },
    { name: "imagen2", maxCount: 1 },
    { name: "imagen3", maxCount: 1 },
  ]),
  updateProyecto
);

router.post("/upload/", upload.single('image'),uploadImage)

export default router;
