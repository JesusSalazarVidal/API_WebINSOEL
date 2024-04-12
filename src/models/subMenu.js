import mongoose from "mongoose";

const submenuSchema = mongoose.Schema ({
    area: {
        type: String,
        required: true
    },
    enlace: { 
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

const SubMenu = mongoose.model('SubMenu', submenuSchema);

export default SubMenu