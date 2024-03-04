import {z} from 'zod'

export const registerSchema = z.object({
    correo: z.string({
        required_error: 'El correo es requerido'
    }),
    nombre: z.string({
        required_error: 'El nombre es requerido'
    }),
    password: z.string({
        required_error: 'La contraseña es requerida'
    }).min(6, {
        message: 'La contraseña debe tener por lo menos 6 caracteres'
    })

})


export const loginSchema = z.object({
    correo: z.string({
        required_error: "El correo es requerido"
    }),
    password: z.string({
        required_error: "La contraseña es requerida"
    }).min(6, {
        message:"La contraseña debe tener al menos 6 caracteres"
    })
})