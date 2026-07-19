import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.json())// it allows the data in req.body in object format
app.use(cookieParser())// to store the jwt tokens in cookies

// CORS configuration for development - allows any localhost port
const corsOptions = {
    origin: function (origin, callback) {
        // Allow localhost with any port during development
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true  // allows credentials to be sent with cross-site requests
}

app.use(cors(corsOptions))

/* require all the routes here */
import {authRouter} from './routes/auth.routes.js'
import {interviewRouter} from './routes/interview.routes.js'


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



export { app };