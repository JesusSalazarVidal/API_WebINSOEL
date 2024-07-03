import { Router } from "express";
import {
  crearProducto,
  deleteProducto,
  updateProducto,
  getProductos,
} from "../controllers/producto.controller.js";

import multer from "multer";

const router = Router();

// Configuración de Multer para manejar múltiples archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads/Productos");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/crearProducto",
  upload.fields([{ name: "imagen", maxCount: 1 }]),
  crearProducto
);

router.get("/obtenerProductos", getProductos);

router.put(
  "/editarProducto/:id",
  upload.fields([{ name: "imagen", maxCount: 1 }]),
  updateProducto
);

router.delete("/eliminarProducto/:id", deleteProducto)

export default router;
