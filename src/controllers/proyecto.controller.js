import fs from "fs/promises";
import Proyecto from "../models/proyecto.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Image from "../models/image.model.js";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 // Función para manejar archivos
 const procesarArchivo = (req, campo) => {
  const file = req.files[campo];
  if (!file || !file[0]) {
    throw new Error(`El archivo ${campo} no se ha proporcionado`);
  }
  console.log(`desc_${campo.charAt(campo.length - 1)}`)
  return {
    nombre: file[0].originalname,
    ruta: file[0].path,
    nuevoNombre: file[0].path.split("\\").pop(),
    descripcion: req.body[`desc_Img${campo.charAt(campo.length - 1)}`],
  
  };
};

export const crearProyecto = async (req, res) => {
  try {
    // Validar la entrada del usuario
    const { titulo, area, fecha, contenido, frase } = req.body;
    if (!titulo || !area || !fecha || !contenido || !frase) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    // Crear una nueva instancia del modelo Proyecto y guardarla en la base de datos
    const nuevoProyecto = new Proyecto({
      titulo,
      area,
      fecha,
      video: procesarArchivo(req, "video"),
      contenido,
      imagenes: [
        procesarArchivo(req, "imagen1"),
        procesarArchivo(req, "imagen2"),
        procesarArchivo(req, "imagen3"),
      ],
      frase,
    });

    await nuevoProyecto.save();

    res.status(200).json({
      mensaje: "Informe creado exitosamente",
      proyecto: nuevoProyecto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el informe" });
  }
};

//Funcion para eliminar archivos como imagenes y videos 
const eliminarArchivo = async(ruta) => {
  const rutaArchivo = path.join(__dirname, "..", "..", ruta);
      //console.log(rutaImagen)
      try {
        await fs.unlink(ruta);
      } catch (error) {
        console.error(`Error al eliminar el rachivo  ${ruta}:`, error);
      }

}

export const updateProyecto = async (req, res) => {
  try {
    const proyectoId = req.params.id;
    const proyectoActualizado = req.body;

    // Buscar el proyecto por su ID
    const proyecto = await Proyecto.findById(proyectoId);

    // Si el proyecto no existe, retornar un error
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    // Actualizar los campos del proyecto con los datos enviados
    proyecto.titulo = proyectoActualizado.titulo;
    proyecto.area = proyectoActualizado.area;
    proyecto.fecha = proyectoActualizado.fecha;
    proyecto.contenido = proyectoActualizado.contenido;
    proyecto.frase = proyectoActualizado.frase;
    proyectoActualizado.video = req.files["video"][0]
    proyectoActualizado.imagen1 = req.files["imagen1"][0]
    proyectoActualizado.imagen2 = req.files["imagen2"][0]
    proyectoActualizado.imagen3 = req.files["imagen3"][0]


    // Actualizar imágenes y videos si se proporcionan
    if (proyectoActualizado.video) {
      //Primero eliminamos el archivo existente para remplazarlo por el nuevo 
      eliminarArchivo(proyecto.video.ruta)
      proyecto.video = {
        nombre: proyectoActualizado.video.originalname,
        ruta: proyectoActualizado.video.path,
        nuevoNombre:
          proyectoActualizado.video.path.split("\\")[
            proyectoActualizado.video.path.split("\\").length - 1
          ],
      }
      //console.log(proyecto.video.ruta)
      //console.log(proyecto.video)
    } 
    if (proyectoActualizado.imagen1) {
      eliminarArchivo(proyecto.imagenes[0].ruta)
      proyecto.imagenes[0] = {
        nombre: proyectoActualizado.imagen1.originalname,
        ruta: proyectoActualizado.imagen1.path,
        nuevoNombre:
          proyectoActualizado.imagen1.path.split("\\")[
            proyectoActualizado.imagen1.path.split("\\").length - 1
          ],
          descripcion: req.body.desc_Img1
      };
    }
    if (proyectoActualizado.imagen2) {
      eliminarArchivo(proyecto.imagenes[1].ruta)
      proyecto.imagenes[1] = {
        nombre: proyectoActualizado.imagen2.originalname,
        ruta: proyectoActualizado.imagen2.path,
        nuevoNombre:
          proyectoActualizado.imagen2.path.split("\\")[
            proyectoActualizado.imagen2.path.split("\\").length - 1
          ],
          descripcion: req.body.desc_Img2
      };
    }
    if (proyectoActualizado.imagen3) {
      eliminarArchivo(proyecto.imagenes[2].ruta)
      proyecto.imagenes[2] = {
        nombre: proyectoActualizado.imagen3.originalname,
        ruta: proyectoActualizado.imagen3.path,
        nuevoNombre:
          proyectoActualizado.imagen3.path.split("\\")[
            proyectoActualizado.imagen3.path.split("\\").length - 1
          ],
          descripcion: req.body.desc_Img3
      };
    }

    // Guardar los cambios
    await proyecto.save();

    return res
      .status(200)
      .json({
        mensaje: "Proyecto actualizado correctamente",
        proyecto: proyecto,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensaje: "Error al actualizar el proyecto", error: error });
  }
};

export const getProyectos = async (req, res) => {
  const proyectos = await Proyecto.find();
  res.json(proyectos);
};

export const getProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    res.status(200).json(proyecto);
  } catch (error) {
    return res.status(404).json({ mensaje: "Proyecto no encontrado" });
  }
};

// Función para buscar proyectos por área
export const buscarProyectosPorArea = async (req, res) => {
  try {
    const { area } = req.params;
    console.log(area)
    const proyectos = await Proyecto.find({ area });
    if (proyectos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron proyectos para el área especificada" });
    }
    res.status(200).json(proyectos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar proyectos por área" });
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

export const uploadImage = async(req, res) =>{
  try {
    // Obtener los datos de la imagen desde la solicitud
    console.log(req.file)
    const imageData = req.file.buffer;
    const contentType = req.file.mimetype;
    console.log(imageData)

    // Guardar la imagen en la base de datos
    const newImage = new Image({
      name: req.file.originalname,
      data: imageData,
      contentType: contentType
    });
    await newImage.save();
    res.send('Imagen cargada con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la imagen');
  }
}
