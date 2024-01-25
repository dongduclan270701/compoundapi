import express from 'express'
import { ipController } from '*/controllers/ip.controller'
import jwt from 'jsonwebtoken'
import { HttpStatusCode } from '*/utils/constants'
const router = express.Router()
const axios = require('axios')

const authAdmin = (req, res, next) => {
    const token = req.header('auth-token-admin')
    if (!token) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json('Access Denied')
    }
    else {
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET_ADMIN)
            req.result = verified
            if (verified.role === 'CEO') {
                next()
            } else if (verified.role === 'DEVELOPER') {
                next()
            } else if (verified.role === 'MANAGEMENT') {
                next()
            } else {
                return res.status(401).json({ message: 'You do not have sufficient permissions to perform this function' })
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER).send('Invalid token')
        }
    }
}

const ip = async (req, res, next) => {
    try {
        const clientIP = req.clientIp
        if (!clientIP) {
            return res.status(400).json({ error: 'Unable to get client IP' })
        }
        const ipInfoResponse = await axios.get(`https://ipinfo.io/${clientIP}?token=597ca5cf40baef`)
        req.body = ipInfoResponse.data
        next()
    } catch (error) {
        console.error('Error fetching IP info', error)
    }
}
router.route('/ipUser')
    .post(ip, ipController.createNewIP)

router.route('/ipList')
    .get(authAdmin, ipController.getFullIP)

router.route('/searchIpList')
    .get(authAdmin, ipController.getSearchIP)

export const ipRoutes = router