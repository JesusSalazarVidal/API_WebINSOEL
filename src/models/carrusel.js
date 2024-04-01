 import mongoose from "mongoose";

 const carruselSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true,

    },
    imagenes: [{
        nombre: String,
        ruta: String,
        nuevoNombre: String,
    }]
 })

const Carrusel = mongoose.model('Carrusel', carruselSchema);

export default Carrusel