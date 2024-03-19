import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';



import solicitudRoutes from "./routes/solicitudContacto.routes.js";
import authRoutes from "./routes/auth.routes.js";
import proyectoRoutes from "./routes/proyecto.routes.js";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Configurar Express para servir archivos estáticos (en el caso de las imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", solicitudRoutes);
app.use("/api", authRoutes);
app.use("/api", proyectoRoutes);

export default app;
