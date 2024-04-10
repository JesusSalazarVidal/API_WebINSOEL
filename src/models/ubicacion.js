import mongoose from "mongoose";

const ubicacionSchema = mongoose.Schema ({
    nombre: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    latitud: {
        type: String,
        required: true
    },
    longitud: {
        type: String,
        required: true
    }
})
const Ubicacion = mongoose.model('Ubicacion', ubicacionSchema);

export default Ubicacion