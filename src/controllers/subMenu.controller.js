import path from "path";
import { fileURLToPath } from "url";
import SubMenu from "../models/subMenu.js"
import fs from "fs/promises";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const crearSubMenu = async (req, res) => {
    try {
        const nuevoSubMenu = new SubMenu ({ 
            area: req.body.area,
            enlace: req.body.enlace,
            img: {
              nombre: req.files["img"][0].originalname, 
        ruta: req.files["img"][0].path,
        nuevoNombre: ((req.files["img"][0].path).split("\\"))[((req.files["img"][0].path).split("\\")).length - 1]
            },
            descripcion: req.body.descripcion,
        });

        await nuevoSubMenu.save();

    res
      .status(200)
      .json({
        mensaje: "Informe creado exitosamente",
        subMenu: nuevoSubMenu,
      });
    } catch (error) {
        console.error(error);
    res.status(500).json({ mensaje: "Error al crear el informe SubMenu" });
    }
};

export const getSubMenu = async (req, res) => {
    const subMenu = await SubMenu.find();
    res.json(subMenu);
  };

  export const getSubMe = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const submenu = await SubMenu.findById(id);
  
      if (!submenu) {
        return res.status(404).json({ mensaje: "SubMenu no encontrado" });
      }
  
      res.json(submenu);
    } catch (error) {
      return res.status(404).json({ mensaje: "SubMenu no encontrado" });
    }
  };

  export const deleteSubMenu = async (req, res) => {
    try {
      const idSubMenu = req.params.id;
      console.log(idSubMenu);
  
      //Obtener el submenu por su ID
      const submenu = await SubMenu.findById(idSubMenu);
  
      if (!submenu) {
        return res.status(404).json({ mensaje: "SubMenu no encontrado" });
      }
  
      //eliminar la imagenes asociadas al carrusel del sistema de archivos
      const rutaImagen = path.join(__dirname, "..", "..", submenu.img.ruta); // Suponiendo que `submenu.img` contiene la información de una sola imagen
console.log(rutaImagen);
try {
  await fs.unlink(rutaImagen);
  console.log(`Imagen ${submenu.img.nombre} eliminada exitosamente`);
} catch (error) {
  console.error(`Error al eliminar la imagen ${submenu.img.nombre}:`, error);
}
  
      // Eliminar el SUBMENU de la base de datos
      const resultado = await SubMenu.deleteOne({ _id: idSubMenu });
  
      res.status(200).json({ mensaje: "Informe eliminado exitosamente SubMenu" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el informe SubMenu" });
    }
  };

  export const updateSubMenu = async (req, res) => {
    try {
      const { id } = req.params;
      const { area, enlace, img, descripcion } = req.body;
  
      // Verificar si el submenu existe
      const submenu = await SubMenu.findById(id);
      if (!submenu) {
        return res.status(404).json({ mensaje: "SubMenu no encontrado" });
      }
  
      // Actualizar los campos
      if (area) submenu.area = area;
      if (enlace) submenu.enlace = enlace;
      if (img) submenu.img = img;
      if (descripcion) submenu.descripcion = descripcion;

  
      // Guardar los cambios en la base de datos
      await submenu.save();
  
      res.status(200).json({ mensaje: "SubMENU actualizado exitosamente", submenu });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar el submenu" });
    }
  };