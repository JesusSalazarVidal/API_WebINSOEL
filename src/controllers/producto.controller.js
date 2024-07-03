import Producto from "../models/producto.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: {
        nombre: req.files["imagen"][0].originalname,
        ruta: req.files["imagen"][0].path,
        nuevoNombre:
          req.files["imagen"][0].path.split("\\")[
            req.files["imagen"][0].path.split("\\").length - 1
          ],
      },
    });

    await nuevoProducto.save();

    res.status(200).json({ mensaje: "Producto creado", Producto: nuevoProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el producto" });
  }
};

export const getProductos = async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
};

export const updateProducto = async (req, res) => {
  try {
    const id_Producto = req.params.id;
    const productoActualizado = req.body;

    //Buscar el producto por si ID
    const producto = await Producto.findById(id_Producto);
    

    // Si el producto no existe, retornamos el error
    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    //Actualizar los campos del producto con los datos enviados por el usuario
    producto.nombre = productoActualizado.nombre;
    producto.descripcion = productoActualizado.descripcion;
    producto.precio = productoActualizado.precio;

    if (req.files["imagen"][0]) {
      //eliminar el archivo existente si es necesario
      if (producto.imagen) {
        eliminarArchivo(producto.imagen.ruta);
      }
      // Actualizar la información de la nueva imagen
      const nuevaImagen = {
        nombre: req.files["imagen"][0].originalname,
        ruta: req.files["imagen"][0].path,
        nuevoNombre: req.files["imagen"][0].path.split("\\").pop(),
      };
      //console.log(nuevaImagen)

      //Asignar la nueva imagen
      producto.imagen = nuevaImagen;
    }

    //Guardar los cambios
    await producto.save();
    return res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      Producto: producto,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensaje: "Error al actualizar el producto", error: error });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    console.log("editando")
    
    const id_Producto = req.params.id
    
    const producto = await Producto.findById(id_Producto)

    if(!producto){
      return res.status(404).json({mensaje: "Producto no encotrado"})
    }

    //eliminar la imagenes asociadas al area del sistema de archivos
    const rutaImagen = path.join(__dirname, "..", "..", producto.imagen.ruta);

    try {
      await fs.unlink(rutaImagen);
      console.log(`Imagen ${producto.imagen.nombre} eliminada exitosamente`);
    } catch (error) {
      console.error(`Error al eliminar la imagen ${producto.imagen.nombre}:`, error);
    }

    // Eliminar el Area de la base de datos
    const resultado = await Producto.deleteOne({ _id: id_Producto });

    res.status(200).json({ mensaje: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el Producto" });
  }
}
//Funcion para eliminar archivos como imagenes y videos
const eliminarArchivo = async (ruta) => {
  const rutaArchivo = path.join(__dirname, "..", "..", ruta);

  try {
    await fs.unlink(ruta);
  } catch (error) {
    console.error(`Error al eliminar el rachivo  ${ruta}:`, error);
  }
};
