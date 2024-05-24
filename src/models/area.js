import mongoose from 'mongoose'

const areaSchema = mongoose.Schema({
    area:{
        type: String,
        required: true
    },
    img: {
        nombre: String,
        ruta: String,
        nuevoNombre: String,
    },
    descripcion: {
        type: String,
        required: true
    },
})

const Area = mongoose.model('Area', areaSchema)

export default Area