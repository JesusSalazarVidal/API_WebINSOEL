import Carrusel from "../models/carrusel.js"
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


 
  export const createCarrusel = async (req, res) => {
    try {
       // Crear una nueva instancia del modelo Proyecto y guardarla en la base de datos
       const nuevoCarrusel = new Carrusel ({
        titulo: req.body.titulo,
        imagenes: [
            {
                nombre: req.files["img1"][0].originalname,
                ruta: req.files["img1"][0].path,
                nuevoNombre: ((req.files["img1"][0].path).split("\\"))[((req.files["img1"][0].path).split("\\")).length - 1]
            },
            {
                nombre: req.files["img2"][0].originalname,
                ruta: req.files["img2"][0].path,
                nuevoNombre: ((req.files["img2"][0].path).split("\\"))[((req.files["img2"][0].path).split("\\")).length - 1]
            },
            {
                nombre: req.files["img3"][0].originalname,
                ruta: req.files["img3"][0].path,
                nuevoNombre: ((req.files["img3"][0].path).split("\\"))[((req.files["img3"][0].path).split("\\")).length - 1]
            },
            {
                nombre: req.files["img4"][0].originalname,
                ruta: req.files["img4"][0].path,
                nuevoNombre: ((req.files["img4"][0].path).split("\\"))[((req.files["img4"][0].path).split("\\")).length - 1]
            }
        ]
       }) 
       await nuevoCarrusel.save();

       res
      .status(200)
      .json({
        mensaje: "Informe creado exitosamente",
        carrusel: nuevoCarrusel,
      });
      
    } catch (error) {
        console.error(error);
    res.status(500).json({ mensaje: "Error al crear el informe" });
    }
  }

  export const updateCarrusel = async (req, res) => {
    try {
        const carruselId = req.params.id;
        const carruselActualizado = req.body;

        // Buscar el carrusel por su ID
        const carrusel = await Carrusel.findById(carruselId);

        // Si el carrusel no existe, retornar un error
        if (!carrusel) {
            return res.status(404).json({ mensaje: "Carrusel no encontrado" });
        }

        // Actualizar los campos del proyecto con los datos enviados
        carrusel.titulo = carruselActualizado.titulo;

        // Actualizar imágenes si se proporcionan
        if (req.files && req.files["imagen1"] && req.files["imagen1"][0]) {
            eliminarArchivo(carrusel.imagenes[0].ruta);
            carrusel.imagenes[0] = {
                nombre: req.files["imagen1"][0].originalname,
                ruta: req.files["imagen1"][0].path,
                nuevoNombre: req.files["imagen1"][0].path.split("\\").pop(),
            };
        }
        if (req.files && req.files["imagen2"] && req.files["imagen2"][0]) {
            eliminarArchivo(carrusel.imagenes[1].ruta);
            carrusel.imagenes[1] = {
                nombre: req.files["imagen2"][0].originalname,
                ruta: req.files["imagen2"][0].path,
                nuevoNombre: req.files["imagen2"][0].path.split("\\").pop(),
            };
        }
        if (req.files && req.files["imagen3"] && req.files["imagen3"][0]) {
            eliminarArchivo(carrusel.imagenes[2].ruta);
            carrusel.imagenes[2] = {
                nombre: req.files["imagen3"][0].originalname,
                ruta: req.files["imagen3"][0].path,
                nuevoNombre: req.files["imagen3"][0].path.split("\\").pop(),
            };
        }
        if (req.files && req.files["imagen4"] && req.files["imagen4"][0]) {
            eliminarArchivo(carrusel.imagenes[3].ruta);
            carrusel.imagenes[3] = {
                nombre: req.files["imagen4"][0].originalname,
                ruta: req.files["imagen4"][0].path,
                nuevoNombre: req.files["imagen4"][0].path.split("\\").pop(),
            };
        }

        // Guardar los cambios
        await carrusel.save();

        return res.status(200).json({
            mensaje: "Carrusel actualizado correctamente",
            carrusel: carrusel,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error al actualizar el carrusel", error: error });
    }
};



  export const getCarruseles = async (req, res) => {
    const carruseles = await Carrusel.find();
    res.json(carruseles);
  };
  
  export const getCarrusel = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const carrusel = await Carrusel.findById(id);
  
      if (!carrusel) {
        return res.status(404).json({ mensaje: "Carrusel no encontrado" });
      }
  
      res.json(carrusel);
    } catch (error) {
      return res.status(404).json({ mensaje: "Carrusel no encontrado" });
    }
  };

  export const getCarruselPorTitulo = async (req, res) => {
    try {
      const { titulo } = req.params;
      console.log(titulo);
      const carrusel = await Carrusel.findOne({ titulo });
  
      if (!carrusel) {
        return res.status(404).json({ mensaje: "Carrusel no encontrado" });
      }
  
      res.json(carrusel);
    } catch (error) {
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  };

  export const deleteCarrusel = async (req, res) => {
    try {
      const idCarrusel = req.params.id;
      console.log(idCarrusel);
  
      //Obtener el carrusel por su ID
      const carrusel = await Carrusel.findById(idCarrusel);
  
      if (!carrusel) {
        return res.status(404).json({ mensaje: "Carrusel no encontrado" });
      }
  
      //eliminar la imagenes asociadas al carrusel del sistema de archivos
      carrusel.imagenes.forEach(async (imagen) => {
        const rutaImagen = path.join(__dirname, "..", "..", imagen.ruta);
        console.log(rutaImagen)
        try {
          await fs.unlink(rutaImagen);
        } catch (error) {
          console.error(`Error al eliminar la imagen ${imagen.nombre}:`, error);
        }
      });
  
      // Eliminar el carrusel de la base de datos
      const resultado = await Carrusel.deleteOne({ _id: idCarrusel });
  
      res.status(200).json({ mensaje: "Informe eliminado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el informe" });
    }
  };

  //Funcion para eliminar archivos como imagenes y videos 
const eliminarArchivo = async(ruta) => {
  const rutaArchivo = path.join(__dirname, "..", "..", ruta);
    
      try {
        await fs.unlink(ruta);
      } catch (error) {
        console.error(`Error al eliminar el rachivo  ${ruta}:`, error);
      }

}





