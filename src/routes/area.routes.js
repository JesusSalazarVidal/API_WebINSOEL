import { Router } from "express";
import {
    crearArea,
    deleteArea,
    getAreas,
    updateArea,
  } from "../controllers/area.controller.js";
  
  import multer from "multer";
  
  const router = Router();
  
  // Configuración de Multer para manejar múltiples archivos
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/public/uploads/Area");
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split(".").pop();
      cb(null, `${Date.now()}.${ext}`);
    },
  });
  
  const upload = multer({ storage: storage });
  
  router.post(
    "/crearArea",
    upload.fields([{ name: "img", maxCount: 1 }]),
    crearArea
  );
  
  router.get("/obtenerAreas", getAreas);
  
  router.put(
    "/editarArea/:id",
    upload.fields([{ name: "img", maxCount: 1 }]),
    updateArea
  );
  router.delete("/eliminarArea/:id", deleteArea);
  
  export default router;