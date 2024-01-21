import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'

// Define Board collection
const noticeName = 'noticeCompound'
const orderSchema = Joi.object({
    time: Joi.string().required(),
    date: Joi.string().required(),
    content: Joi.string().required(),
    status: Joi.string().required(),
    _destroy: Joi.boolean().default(false),
    orderId: Joi.string().required(),
    createDate: Joi.object({
        time: Joi.string().required(),
        date: Joi.string().required()
    }),
    isReadCus: Joi.boolean().default(false),
    isReadAdmin: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await orderSchema.validateAsync(data, { abortEarly: false }) // Hiển thị đầy đủ lỗi nếu trong trường data có 2 field trở lên bị lỗi
}

const createNewNotice = async (data) => {
    try {
        const date = new Date();
        const minutes = date.getMinutes();
        const hours = date.getHours();
        const time = `${hours}:${minutes}`;
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const today = `${year}-${month}-${day}`
        const newData = { 
            ...data, 
            createDate:{
                time: time, 
                date: today
            }
        }
        const value = await validateSchema(newData)
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
                    status: { $in:  ['Chờ xác nhận'] },
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