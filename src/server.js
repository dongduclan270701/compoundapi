import express from 'express'
import { connectDB } from '*/config/mongodb.js'
import { env } from '*/config/environment'
import { apiV1 } from '*/routes/v1'
import { corsOptions } from '*/config/cors.js'
const axios = require('axios');
const cors = require('cors')
const requestIp = require('request-ip');
const expressip = require('express-ip');
connectDB()
    .then(() => console.log('Connected MongoDB successfully to server'))
    .then(() => bootServer())
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
const bootServer = () => {
    const app = express()

    app.use(cors(corsOptions))
    app.use(expressip().getIpInfoMiddleware)
    // Enable req.body data
    app.use(express.json())
    app.use(requestIp.mw())
    // Use APIs v1
    app.use('/v1', apiV1)
    // app.use('/ip', async (req, res, next) => {
    //     try {
    //         const clientIP = req.clientIp; // Lấy địa chỉ IP từ middleware

    //         if (!clientIP) {
    //             return res.status(400).json({ error: 'Unable to get client IP' })
    //         }
    //         const ipInfoResponse = await axios.get(`https://ipinfo.io/${clientIP}?token=597ca5cf40baef`)

    //         console.log(ipInfoResponse.data)

    //     } catch (error) {
    //         console.error('Error fetching IP info', error)
    //         next()
    //     }
    // });
    app.listen(env.APP_PORT, env.APP_HOST, () => {
        console.log(`Hello KassDev, I'm running at ${env.APP_HOST}:${env.APP_PORT}/`)
    })

}