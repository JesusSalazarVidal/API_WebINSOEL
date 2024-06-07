import Ubicacion from "../models/ubicacion.js";

export const crearUbicacion = async (req, res) => {
    const { nombre, direccion, latitud, longitud } = req.body;

    const newUbicacion = new Ubicacion({
        nombre: nombre,
        direccion: direccion,
        latitud: latitud,
        longitud: longitud,
      });
      const savedUbicacion = await newUbicacion.save();
      res.json(savedUbicacion);

}

export const getUbicaciones = async (req, res) => {
    const ubicaciones = await Ubicacion.find();
    res.json(ubicaciones);
}

export const deleteUbicacion = async (req, res) => {
    try {
        const idUbicacion = req.params.id;
        console.log(idUbicacion);
    
        //Obtener la ubicacion por su ID
        const ubicacion = await Ubicacion.findById(idUbicacion);
    
        if (!ubicacion) {
          return res.status(404).json({ mensaje: "Ubicacion no encontrada" });
        }
// Eliminar el ubicacion de la base de datos
const resultado = await Ubicacion.deleteOne({ _id: idUbicacion });
  
res.status(200).json({ mensaje: "Informe eliminado exitosamente" });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const updateUbicacion = async (req, res) => {
    console.log('ID:', req.params.id);
    console.log('Datos:', req.body);
    //console.log(req.params.id);
    try {
      const { nombre, direccion, latitud, longitud } = req.body;
      const ubicacionUpdate = await Ubicacion.findOneAndUpdate(
        { _id: req.params.id },
        { nombre, direccion, latitud, longitud },
        { new: true }
      );
      if (!ubicacionUpdate) {
        return res.status(404).json({ error: 'Ubicación no encontrada' });
    }
    res.json(ubicacionUpdate);
    
    } catch (error) {
      // Maneja cualquier error potencial aquí y envía una respuesta apropiada.
      console.error(error);
      // Envía una respuesta de error, si es necesario.
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  
  export const getUbicacion = async (req, res) => {
    try {
      const ubicacion = await Ubicacion.findById(req.params.id);
  
      if (!ubicacion) return res.status(404).json({ message: error.message });
      return res.json(ubicacion);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
