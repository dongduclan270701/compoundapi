import Joi from 'joi'
import { HttpStatusCode } from '*/utils/constants'

const createNewBlackListAccountUser = async (req, res, next) => {
    const condition = Joi.object({
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

const updateUserInformationForAdmin = async (req, res, next) => {
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

export const BlackListValidation = { createNewBlackListAccountUser, updateUserInformationForAdmin }