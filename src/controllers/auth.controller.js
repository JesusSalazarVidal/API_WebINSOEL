/**
 * Autor: Jesus Salazar
 * Febrero 14, 2024
 */

import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { nombre, correo, password } = req.body;
  //console.log(req.body)

  try {
    const userFound = await Usuario.findOne({ correo });
    if (userFound)
      return res
        .status(400)
        .json({ error: ["El correo del usuario ya existe"] });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUsuario = new Usuario({
      nombre: nombre,
      correo: correo,
      password: passwordHash,
    });

    const userSaved = await newUsuario.save();
    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.status(200).json({
      id: userSaved._id,
      nombre: userSaved.nombre,
      correo: userSaved.correo,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const userFound = await Usuario.findOne({ correo });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      id: userFound._id,
      correo: userFound.correo,
      nombre: userFound.nombre,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expire: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await Usuario.findById(req.user.id);
  console.log(userFound)

  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });

  return res.json({
    id: userFound._id,
    correo: userFound.correo,
    nombre: userFound.nombre,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  

  if (!token) return res.status(401).json({ message: "No autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, usuario) => {
    if (err) {
      console.error("Error al verificar el token:", err);
      return res.status(401).json({ message: "No autorizado" });
    }
    
    console.log(usuario.id)
    const userFound = await Usuario.findById(usuario.id);
    
    if (!userFound) return res.status(401).json({ message: "No autorizado" });

    return res.json({
      id: userFound._id,
      correo: userFound.correo,
      nombre: userFound.nombre,
    });
  });
};
