import express from 'express'
import { userController } from '*/controllers/user.controller'
import { UserValidation } from '*/validations/user.validation'
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
const authUser = (req, res, next) => {
    const token = req.header('auth-token-user')
    if (!token) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json('Access Denied')
    }
    else {
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET_CUSTOMER)
            req.result = verified
            if (verified) {
                next()
            } else {
                return res.status(401).json({ message: 'You do not have sufficient permissions to perform this function' })
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER).send('Invalid token')
        }
    }
}
router.route('/accountUser')
    .post(UserValidation.createNewAccountUser, userController.createNewAccountUser)

router.route('/login/:phoneNumber/:password')
    .get(userController.loginAccountUser)

router.route('/accountUser/:phoneNumber')
    .get(authUser, userController.getInformationAccountUser)
//     .put(authUser, UserValidation.updateAccountUser, userController.updateAccountUser)

router.route('/accountUserForAdmin/:phoneNumber')
    .get(authAdmin, userController.getInformationAccountUserForAdmin)
    // .put(authAdmin, UserValidation.updateAccountUser, userController.updateAccountUser)

export const userRoutes = router