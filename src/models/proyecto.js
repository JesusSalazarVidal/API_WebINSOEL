import mongoose, { isObjectIdOrHexString } from 'mongoose'

const proyectoSchema = mongoose.Schema({
    titulo:{
        type: String,
        required: true,
    },
    area:{
        type:String
    },
    imagenes: [{
        nombre: String,
        ruta: String,
        nuevoNombre: String,
        descripcion: String,
    }],
    fecha: {
        type: Date,
        default: Date.now
    },
    contenido: String,
    frase: String,
    video:{
        nombre: String,
        ruta: String,
        nuevoNombre: String
    }
})

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

export default Proyecto