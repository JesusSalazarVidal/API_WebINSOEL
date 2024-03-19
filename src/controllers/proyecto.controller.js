import fs from "fs/promises";
import Proyecto from "../models/proyecto.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const crearProyecto = async (req, res) => {
  try {
    // Crear una nueva instancia del modelo Proyecto y guardarla en la base de datos
    const nuevoProyecto = new Proyecto({
      titulo: req.body.titulo,
      fecha: req.body.fecha,
      video: {
        nombre: req.files["video"][0].originalname,
        ruta: req.files["video"][0].path,
        nuevoNombre: ((req.files["video"][0].path).split("\\"))[((req.files["video"][0].path).split("\\")).length - 1]
      },
      contenido: req.body.contenido,
      imagenes: [
        {
          nombre: req.files["imagen1"][0].originalname,
          ruta: req.files["imagen1"][0].path,
          nuevoNombre: ((req.files["imagen1"][0].path).split("\\"))[((req.files["imagen1"][0].path).split("\\")).length - 1]
        },
        {
          nombre: req.files["imagen2"][0].originalname,
          ruta: req.files["imagen2"][0].path,
          nuevoNombre: ((req.files["imagen2"][0].path).split("\\"))[((req.files["imagen2"][0].path).split("\\")).length - 1]
        },
        {
          nombre: req.files["imagen3"][0].originalname,
          ruta: req.files["imagen3"][0].path,
          nuevoNombre: ((req.files["imagen3"][0].path).split("\\"))[((req.files["imagen3"][0].path).split("\\")).length - 1]
        },
      ],
      frase: req.body.frase,
    });

    await nuevoProyecto.save();

    res
      .status(200)
      .json({
        mensaje: "Informe creado exitosamente",
        proyecto: nuevoProyecto,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el informe" });
  }
};

export const getProyectos = async (req, res) => {
  const proyectos = await Proyecto.find();
  res.json(proyectos);
};

export const getProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    res.json(proyecto);
  } catch (error) {
    return res.status(404).json({ mensaje: "Proyecto no encontrado" });
  }
};

export const deleteProyecto = async (req, res) => {
  try {
    const idProyecto = req.params.id;
    console.log(idProyecto);

    //Obtener el prroyceto por su ID
    const proyecto = await Proyecto.findById(idProyecto);

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    //eliminar la imagenes asociadas al proyecto del sistema de archivos
    proyecto.imagenes.forEach(async (imagen) => {
      const rutaImagen = path.join(__dirname, "..", "..", imagen.ruta);
      //console.log(rutaImagen)
      try {
        await fs.unlink(rutaImagen);
      } catch (error) {
        console.error(`Error al eliminar la imagen ${imagen.nombre}:`, error);
      }
    });

    //Eliminar Video
    const rutaVideo = path.join(__dirname, "..", "..", proyecto.video.ruta);
    //console.log(rutaVideo)
    try {
      await fs.unlink(rutaVideo);
    } catch (error) {
      console.error(
        `Error al eliminar el video ${proyecto.video.nombre}:`,
        error
      );
    }

    // Eliminar el proyecto de la base de datos
    const resultado = await Proyecto.deleteOne({ _id: idProyecto });

    res.status(200).json({ mensaje: "Informe eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el informe" });
  }
};
