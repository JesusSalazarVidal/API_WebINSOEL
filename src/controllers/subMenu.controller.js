import path from "path";
import { fileURLToPath } from "url";
import SubMenu from "../models/subMenu.js";
import fs from "fs/promises";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const crearSubMenu = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { area1, area2, area3, area4, enlace1, enlace2, enlace3, enlace4 } =
      req.body;
    console.log(req.body);
    // Crear un nuevo documento de SubMenu
    const nuevoSubMenu = new SubMenu({
      area1,
      area2,
      area3,
      area4,
      enlace1,
      enlace2,
      enlace3,
      enlace4,
    });
    // Guardar el nuevo documento en la base de datos
    const subMenuGuardado = await nuevoSubMenu.save();

    // Enviar una respuesta de éxito al cliente
    res.status(201).json({
      mensaje: "SubMenu guardado correctamente",
      subMenu: subMenuGuardado,
    });
  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    res
      .status(500)
      .json({ error: "Error al guardar el SubMenu", mensaje: error.message });
  }
};

export const updateSubMenu = async (req, res) => {
  try {
    // Extraer el ID del submenu de los parámetros de la solicitud
    const { id } = req.params;

    // Extraer los datos a actualizar del cuerpo de la solicitud
    const { area1, area2, area3, area4, enlace1, enlace2, enlace3, enlace4 } =
      req.body;

    // Buscar el submenu por su ID y actualizarlo
    const subMenuActualizado = await SubMenu.findByIdAndUpdate(
      id,
      {
        area1,
        area2,
        area3,
        area4,
        enlace1,
        enlace2,
        enlace3,
        enlace4,
      },
      { new: true }
    );

    // Verificar si el submenu fue encontrado y actualizado
    if (!subMenuActualizado) {
      return res.status(404).json({ error: "SubMenu no encontrado" });
    }

    // Enviar una respuesta de éxito al cliente con el submenu actualizado
    res.status(200).json({
      mensaje: "SubMenu actualizado correctamente",
      subMenu: subMenuActualizado,
    });
  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    res.status(500).json({
      error: "Error al actualizar el SubMenu",
      mensaje: error.message,
    });
  }
};

export const getSubMenu = async (req, res) => {
  const subMenu = await SubMenu.find();
  res.json(subMenu);
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
      console.error(
        `Error al eliminar la imagen ${submenu.img.nombre}:`,
        error
      );
    }

    // Eliminar el SUBMENU de la base de datos
    const resultado = await SubMenu.deleteOne({ _id: idSubMenu });

    res.status(200).json({ mensaje: "Informe eliminado exitosamente SubMenu" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el informe SubMenu" });
  }
};

export const obtenerSubMenuRef = async (req, res) => {
  try {
    // Obtener un documento de SubMenu por su ID y rellenar los campos de referencia con los datos completos de las áreas y proyectos
    const subMenu = await SubMenu.findById(req.params.id).populate(
      "area1 area2 area3 area4"
    );

    // Enviar una respuesta con el submenu y sus referencias pobladas
    res.status(200).json({ subMenu });
  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    res.status(500).json({ error: 'Error al obtener el SubMenu con referencias pobladas', mensaje: error.message });
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
