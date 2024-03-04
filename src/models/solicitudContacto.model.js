import mongoose from 'mongoose'

const solicitudContactoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  empresa: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  telefono: {
    type: Number,
    required: true,
  },
  servicio: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
});

const SolicitudContacto = mongoose.model("SolicitudContacto", solicitudContactoSchema);
export default SolicitudContacto;
