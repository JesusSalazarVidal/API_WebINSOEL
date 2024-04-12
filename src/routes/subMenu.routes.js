import { Router } from "express";
import { 
    crearSubMenu,
    getSubMenu,
    getSubMe,
    deleteSubMenu,
    updateSubMenu,
} from "../controllers/subMenu.controller.js"

import multer from "multer";

const router = Router();

// Configuración de Multer para manejar múltiples archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads/SubMenu');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
}); 

const upload = multer({ storage: storage });

router.post(
  "/crearSubMenu",
  upload.fields([
    { name: "img", maxCount: 1 },
  ]),
  crearSubMenu
);

router.get("/obtenerSubMenus", getSubMenu);

router.delete("/eliminarSubMenu/:id", deleteSubMenu)

router.get("/submenu/:id", getSubMe)

router.put("/editarSubMenu/:id", updateSubMenu);

export default router;