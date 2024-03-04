/**
 * Autor: Jesus Salazar
 * Febrero 14, 2024
 */

//importamos mongoose
import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema(
    {
        nombre:{
            type: String,
            required: true,
        },
        correo:{
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,//el trim nos ayuda a eliminar espacios en blanco al principio o al inicio
        },
        password:{
            type: String,
            required: true,
        }

    },
    {timestamps: true}
)

const Usuario = mongoose.model('Usuario', usuarioSchema)

export default Usuario