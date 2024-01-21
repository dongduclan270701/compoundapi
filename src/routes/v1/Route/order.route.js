import express from 'express'
import { orderValidation } from '*/validations/order.validation'
import { orderController } from '*/controllers/order.controller'
import jwt from 'jsonwebtoken'
import { HttpStatusCode } from '*/utils/constants'

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

const router = express.Router()

router.route('/createOrder')
    .post(orderValidation.createNewOrder, orderController.createNewOrder)

// router.route('/search')
//     .get(authCustomer, orderCustomerController.getSearchOrder)

router.route('/orderForAdmin')
    .get(authAdmin, orderController.getFullOrderForAdmin)

router.route('/orderForAdmin/:id')
    .get(authAdmin, orderController.getFullOrderInformationForAdmin)
    .put(authAdmin, orderController.updateOrderInformationForAdmin)

// router.route('/:id')
//     .put(authCustomer, orderCustomerController.update)

// router.route('/ratingOrder/:id')
//     .put(authCustomer, orderCustomerController.ratingOrder)

export const orderRoutes = router