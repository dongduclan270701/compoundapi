import Joi from 'joi'
import { HttpStatusCode } from '*/utils/constants'

const createNewAccountAdmin = async (req, res, next) => {
    const condition = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        email: Joi.string().required(),
        role: Joi.string().required()
    })
    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            error: new Error(error).message
        })
    }
}

const updateAccountAdmin = async (req, res, next) => {
    const condition = Joi.object({
    })
    try {
        await condition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            error: new Error(error).message
        })
    }
}

export const AdminValidation = { createNewAccountAdmin, updateAccountAdmin }