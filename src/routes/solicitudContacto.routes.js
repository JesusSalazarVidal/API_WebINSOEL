import {Router} from 'express'
import {createSolicitud, getSolicitudes, updateSolicitud} from '../controllers/solicitudContacto.controller.js'

const router = Router();

router.post('/enviarSolicitud', createSolicitud)
router.get('/obtenerSolicitudes', getSolicitudes)
router.put('/actualizarSolicitud/:id',updateSolicitud) // Ruta para actualizar una solicitud de su estado si esta terminado 

export default router; 