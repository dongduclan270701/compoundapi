import Joi from 'joi'
import { HttpStatusCode } from '*/utils/constants'

const createNewOrder = async (req, res, next) => {
    const condition = Joi.object({
        pick_up_location: Joi.string().required(),
        destination: Joi.string().required(),
        time: Joi.object({
            hour: Joi.string().required(),
            date: Joi.string().required()
        }).required(),
        username: Joi.string().required(),
        phoneNumber: Joi.string().required()
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

const updateOrder = async (req, res, next) => {
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

export const orderValidation = { 
    createNewOrder, 
    updateOrder 
}