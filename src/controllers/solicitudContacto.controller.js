import solicitudContacto from "../models/solicitudContacto.model.js";

import nodemailer from "nodemailer"; 

export const getSolicitudes = async (req, res) => {
  const solicitudes = await solicitudContacto.find();
  res.json(solicitudes);
};

export const createSolicitud = async (req, res) => {
  //console.log(req.body)
  try {
    const { nombre, empresa, correo, telefono, servicio, descripcion } =
      req.body;

    const newSolcitud = new solicitudContacto({
      nombre: nombre,
      empresa: empresa,
      correo: correo,
      telefono: telefono,
      servicio: servicio,
      descripcion: descripcion,
    });
    const savedSolicitud = await newSolcitud.save();

    //configurar el transporte de nodemailer con las credenciales del servicio de correo electronico

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "insoel.ventas@gmail.com",//Usuario es el correo del cual se enviara el correo
        pass: "qwkh gatf tfsd vsnq",//El pass se genero desde la cuneta de google por medio de contraseña de aplicaciones esta correponde a WebInsoel
      },
    });

    // Configurar el mensaje de correo
    const mailOptions = {
      from: "insoel.ventas@gmail.com",
      to: correo,
      subject: "Prueba correo",
      html: `
        <p>Buenos dias ${nombre} gracias por tu interes en nuestro servicio de ${servicio} nos pondremos en contacto contigo lo más pronto posible.</p>
        <br>
        <p>Mensaje envidado desde nodemailer </p>
      `,
      attachments: [
        {
          filename: "Logo.png",
          path: "src/img/Logo.png",
          cid: "logoInsoel",
        },
      ],
    };

    //Enviar el correo
    await transporter.sendMail(mailOptions);

     // Enviar respuesta al cliente
     console.log('Correo enviado con exito')
     res.status(200).json(savedSolicitud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al enviar el correo' });
  }
};

// Actualizar el estado de una solicitud
export const updateSolicitud = async (req, res) => {
  const { id } = req.params;
  const { terminada } = req.body;
  try {
    const solicitud = await solicitudContacto.findByIdAndUpdate(id, { terminada }, { new: true });
    res.json(solicitud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la solicitud' });
  }
}
