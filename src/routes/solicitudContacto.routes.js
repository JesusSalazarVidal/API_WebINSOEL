import {Router} from 'express'
import {createSolicitud, getSolicitudes} from '../controllers/solicitudContacto.controller.js'

const router = Router();

router.post('/enviarSolicitud', createSolicitud)
router.get('/obtenerSolicitudes', getSolicitudes)

export default router;