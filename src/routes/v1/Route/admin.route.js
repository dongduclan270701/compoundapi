import express from 'express'
import { adminController } from '*/controllers/admin.controller'
import { AdminValidation } from '*/validations/admin.validation'
import jwt from 'jsonwebtoken'
import { HttpStatusCode } from '*/utils/constants'
const router = express.Router()

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

router.route('/accountAdmin')
    .post(AdminValidation.createNewAccountAdmin, adminController.createNewAccountAdmin)

router.route('/login/:email/:password')
    .get(adminController.loginAccountAdmin)

router.route('/accountAdmin/:email')
    .get(authAdmin, adminController.getInformationAccountAdmin)
    .put(authAdmin, AdminValidation.updateAccountAdmin, adminController.updateAccountAdmin)

export const adminRoutes = router