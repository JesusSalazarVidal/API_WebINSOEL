import Area from "../models/area.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const crearArea = async (req, res) => {
  try {
    const nuevaArea = new Area({
      area: req.body.area,
      enlace: req.body.enlace,
      img: {
        nombre: req.files["img"][0].originalname,
        ruta: req.files["img"][0].path,
        nuevoNombre:
          req.files["img"][0].path.split("\\")[
            req.files["img"][0].path.split("\\").length - 1
          ],
      },
      descripcion: req.body.descripcion,
    });

    await nuevaArea.save();

    res.status(200).json({
      mensaje: "Area creada ",
      Area: nuevaArea,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el area" });
  }
};

export const getAreas = async (req, res) => {
  const areas = await Area.find();
  res.json(areas);
};

export const updateArea = async (req, res) => {
  try {
    const areaId = req.params.id;
    const areaActualizada = req.body;

    // Buscar el area por su ID
    const area = await Area.findById(areaId);

    // Si el area no existe, retornar un error
    if (!area) {
      return res.status(404).json({ mensaje: "area no encontrada" });
    }

    // Actualizar los campos del proyecto con los datos enviados
    area.area = areaActualizada.area;
    area.enlace = areaActualizada.enlace;
    area.descripcion = areaActualizada.descripcion;
    areaActualizada.img = req.files["img"][0];

    if (areaActualizada.img) {
      // Eliminar el archivo existente si es necesario
      if (area.img) {
        eliminarArchivo(area.img.ruta);
      }

      // Actualizar la información de la nueva imagen
      const nuevaImagen = {
        nombre: areaActualizada.img.originalname,
        ruta: areaActualizada.img.path,
        nuevoNombre: areaActualizada.img.path.split("\\").pop(),
      };

      // Asignar la nueva imagen al submenú
      area.img = nuevaImagen;
    }

    // Guardar los cambios
    await area.save();

    return res.status(200).json({
      mensaje: "area actualizado correctamente",
      area: area,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensaje: "Error al actualizar el area", error: error });
  }
};

export const deleteArea = async (req, res) => {
  try {
    const idArea = req.params.id;
    console.log(idArea);

    //Obtener el submenu por su ID
    const area = await Area.findById(idArea);

    if (!area) {
      return res.status(404).json({ mensaje: "Area no encontrada" });
    }

    //eliminar la imagenes asociadas al area del sistema de archivos
    const rutaImagen = path.join(__dirname, "..", "..", area.img.ruta); // Suponiendo que `submenu.img` contiene la información de una sola imagen
    //console.log(rutaImagen);
    try {
      await fs.unlink(rutaImagen);
      console.log(`Imagen ${area.img.nombre} eliminada exitosamente`);
    } catch (error) {
      console.error(`Error al eliminar la imagen ${area.img.nombre}:`, error);
    }

    // Eliminar el Area de la base de datos
    const resultado = await Area.deleteOne({ _id: idArea });

    res.status(200).json({ mensaje: "Area eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el area" });
  }
};

//Funcion para eliminar archivos como imagenes y videos
const eliminarArchivo = async (ruta) => {
  const rutaArchivo = path.join(__dirname, "..", "..", ruta);

  try {
    await fs.unlink(ruta);
  } catch (error) {
    console.error(`Error al eliminar el rachivo  ${ruta}:`, error);
  }
};
