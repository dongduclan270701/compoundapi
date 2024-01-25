import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'

// Define Board collection
const noticeName = 'noticeCompound'
const orderSchema = Joi.object({
    username: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    status: Joi.string().required(),
    content: Joi.string().required(),
    _destroy: Joi.boolean().default(false),
    createDate: Joi.object({
        time: Joi.string().required(),
        date: Joi.string().required()
    }).required(),
    isReadCus: Joi.boolean().default(false),
    isReadAdmin: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await orderSchema.validateAsync(data, { abortEarly: false }) // Hiển thị đầy đủ lỗi nếu trong trường data có 2 field trở lên bị lỗi
}

const createNewNotice = async (data) => {
    try {
        const value = await validateSchema(data)
        const result = await getDB().collection(noticeName).insertOne(value)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getFullNotice = async () => {
    try {
        const result = await getDB().collection(noticeName).aggregate([
            {
                $match: {
                    status: { $in: ['Chờ xác nhận'] },
                    isReadAdmin: false,
                    _destroy: false
                }
            }
        ]).toArray()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getUpdateNotice = async (id) => {
    try {
        const updateNotice = await getDB().collection(noticeName).findOneAndUpdate(
            {
                _id: ObjectId(id)
            },
            { $set: { isReadAdmin: true } },
            { returnDocument: 'after' }
        )
        return updateNotice.value
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (id) => {
    try {
        const result = await getDB().collection(noticeName).findOne({ _id: ObjectId(id) })
        return result
    } catch (error) {
        throw new Error(error)
    }
}


export const noticeModel = {
    createNewNotice,
    findOneById,
    getFullNotice,
    getUpdateNotice
}