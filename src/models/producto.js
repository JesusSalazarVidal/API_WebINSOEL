import mongoose from 'mongoose'

const productoShema = mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    descripcion:{
        type: String,
        required: true,
    },
    precio:{
        type: Number ,
        required: true,
    },
    imagen:{
        nombre: String,
        ruta: String,
        nuevoNombre: String,
    }
})

const Producto = mongoose.model('Producto', productoShema)

export default Producto