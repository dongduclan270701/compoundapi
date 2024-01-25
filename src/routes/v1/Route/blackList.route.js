import express from 'express'
import { blackListController } from '*/controllers/blackList.controller'
import { BlackListValidation } from '*/validations/blackList.validation'
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

router.route('/blackListAccountUser')
    .post(authAdmin, BlackListValidation.createNewBlackListAccountUser, blackListController.createNewBlackListAccountUser)
    
router.route('/blackListAccountUserForAdmin/:phoneNumber')
    .get(authAdmin, blackListController.getBlackListUserForAdmin)
    .put(authAdmin, blackListController.updateBlackListUserInformationForAdmin)

router.route('/searchBlackListAccountUser')
    .get(authAdmin, blackListController.getSearchBlackListUserForAdmin)

router.route('/blackListAccountUserForAdmin')
    .get(authAdmin, blackListController.getFullBlackListUserForAdmin)

export const blackListRoutes = router