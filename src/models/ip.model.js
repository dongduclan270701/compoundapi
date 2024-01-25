import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'

const accountUserCollectionName = 'ipCompound'
const accountUserCollectionSchema = Joi.object({
    ip: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postal: Joi.string().required(),
    timezone: Joi.string().required(),
    count: Joi.number().default(0),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await accountUserCollectionSchema.validateAsync(data, { abortEarly: false }) // Hiển thị đầy đủ lỗi nếu trong trường data có 2 field trở lên bị lỗi
}

const createNewIP = async (data) => {
    try {
        const newData = {
            ip: data.ip,
            city: data.city,
            country: data.country,
            postal: data.postal,
            timezone: data.timezone
        }
        const value = await validateSchema(newData)
        const dataFind = await getDB().collection(accountUserCollectionName).aggregate([
            {
                $match: {
                    ip: data.ip,
                    _destroy: false
                }
            }
        ]).toArray()
        if (dataFind.length > 0) {
            const result = await getDB().collection(accountUserCollectionName).findOneAndUpdate(
                { ip: newData.ip },
                { $inc: { count: 1 } },
                { returnDocument: 'after' }
            )
            return result
        } else {
            const result = await getDB().collection(accountUserCollectionName).insertOne(value)
            return result
        }
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (id) => {
    try {
        const result = await getDB().collection(accountUserCollectionName).findOne({ _id: ObjectId(id) })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getSearchUserForAdmin = async (data) => {
    try {
        console.log(data)
        let perPage = 10
        let page = parseInt(data.count)
        let status = data.status
        if (status === '') {
            status = { $in: [true, false] }
        } else {
            status = status === 'true' ? true : false
        }
        const result = await getDB().collection(accountUserCollectionName)
            .aggregate([
                {
                    $match: {
                        phoneNumber: { $regex: new RegExp(data.phoneNumber, 'i') },
                        status: status,
                        _destroy: false
                    }
                }
            ])
            .sort({
                'createDate.time': -1,
                'createDate.date': -1
            })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .toArray()
        const resultTotal = await getDB().collection(accountUserCollectionName).aggregate([
            {
                $match: {
                    phoneNumber: { $regex: new RegExp(data.phoneNumber, 'i') },
                    status: status,
                    _destroy: false
                }
            }
        ]).toArray()
        return { data: [...result], total: resultTotal.length }
    } catch (error) {
        throw new Error(error)
    }
}


export const IpModel = {
    createNewIP,
    findOneById,
    getSearchUserForAdmin
}