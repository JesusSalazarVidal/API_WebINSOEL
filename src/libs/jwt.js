/**
 * Autor: Jesus Salazar
 * Febrero 14, 2024
 */

import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// Función para crear un token de acceso usando JWT
export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    // Genera el token utilizando la biblioteca jsonwebtoken
    jwt.sign(
      payload, // Datos que se incluirán en el token (payload)
      TOKEN_SECRET, // Clave secreta para firmar el token
      {
        expiresIn: "1h", // Tiempo de expiración del token (1 hora  en este caso)
      },
      (err, token) => {
        // Maneja los posibles errores durante la generación del token
        if (err) reject(err);

        // Resuelve la promesa con el token generado
        resolve(token);
      }
    );
  });
}
