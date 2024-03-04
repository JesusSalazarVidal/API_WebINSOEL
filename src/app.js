import express from 'express'
import morgan from 'morgan'
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import cors from 'cors'

import solicitudRoutes from './routes/solicitudContacto.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api',solicitudRoutes)
app.use('/api',authRoutes)

export default app;