 import { Router } from "express";
 import { 
    createCarrusel, 
    getCarruseles, 
    getCarrusel,
    getCarruselPorTitulo,
    deleteCarrusel,
    updateCarrusel,
} from "../controllers/carrusel.controller.js";
 import multer from "multer";

 const router = Router();

// Configuración de Multer para manejar múltiples archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads/carrusel');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});

const upload = multer({ storage: storage });

router.post(
    "/crearCarrusel",
    upload.fields([
      { name: "img1", maxCount: 1 },
      { name: "img2", maxCount: 1 },
      { name: "img3", maxCount: 1 },
      { name: "img4", maxCount: 1 },
    ]),
    createCarrusel
  );

router.get("/obtenerCarruseles", getCarruseles);

router.delete("/eliminarCarrusel/:id", deleteCarrusel)

router.get("/carrusel/:titulo", getCarruselPorTitulo);

router.get("/carrusel/:id", getCarrusel)

router.put(
  '/editarCarrusel/:id',
  upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 },
  ]),
  updateCarrusel
);

export default router;