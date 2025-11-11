import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import authRoutes from './routes/authRoutes.js'
import gymRoutes from './routes/gymRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
const app = express()
app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/auth', authRoutes)
app.use('/gyms', gymRoutes)
app.use('/clients', clientRoutes)
export default app