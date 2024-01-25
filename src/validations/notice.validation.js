import Joi from 'joi'
import { HttpStatusCode } from '*/utils/constants'

const createNewNotice = async (req, res, next) => {
    const condition = Joi.object({
        username: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        content: Joi.string().required(),
        status: Joi.string().required(),
        createDate: Joi.object({
            time: Joi.string().required(),
            date: Joi.string().required()
        }).required()
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

const getUpdateNotice = async (req, res, next) => {
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

export const noticeValidation = { createNewNotice, getUpdateNotice }