import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'

const accountUserCollectionName = 'userCompound'
const accountUserCollectionSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    status: Joi.boolean().default(true),
    totalOrder: Joi.number().default(0),
    createDate: Joi.object({
        time: Joi.string().required(),
        date: Joi.string().required()
    }),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await accountUserCollectionSchema.validateAsync(data, { abortEarly: false }) // Hiển thị đầy đủ lỗi nếu trong trường data có 2 field trở lên bị lỗi
}

const createNewAccountUser = async (data) => {
    try {
        const date = new Date()
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const time = `${hours}:${minutes}`
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const today = `${year}-${month}-${day}`
        const newData = {
            ...data,
            createDate: {
                time: time,
                date: today
            }
        }
        const value = await validateSchema(newData)
        const dataFind = await getDB().collection(accountUserCollectionName).aggregate([
            {
                $match: {
                    phoneNumber: value.phoneNumber,
                    _destroy: false
                }
            }
        ]).toArray()
        if (dataFind.length > 0) {
            return { message: 'Phone number already exists' }
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

const loginAccountUser = async (phoneNumber) => {
    try {
        const result = await getDB().collection(accountUserCollectionName).aggregate([
            {
                $match: {
                    phoneNumber: phoneNumber,
                    _destroy: false
                }
            }
        ]).toArray()
        return result[0] || { message: 'Not found user' }
    } catch (error) {
        throw new Error(error)
    }
}

const getInformationAccountUserForAdmin = async (phoneNumber) => {
    try {
        const result = await getDB().collection(accountUserCollectionName).aggregate([
            {
                $match: {
                    phoneNumber: phoneNumber,
                    _destroy: false
                }
            }
        ]).toArray()
        return result[0] || { message: 'Not found account user' }
    } catch (error) {
        throw new Error(error)
    }
}

const getInformationAccountUser = async (phoneNumber) => {
    try {
        const result = await getDB().collection(accountUserCollectionName).aggregate([
            {
                $match: {
                    phoneNumber: phoneNumber,
                    _destroy: false
                }
            }
        ]).toArray()
        return result[0] || { message: 'Not found account user' }
    } catch (error) {
        throw new Error(error)
    }
}

const getFullUserForAdmin = async (data) => {
    try {
        let perPage = 10
        let page = parseInt(data.count)
        const result = await getDB().collection(accountUserCollectionName)
            .find()
            .limit(perPage)
            .skip((perPage * page) - perPage)
            .toArray()
        const resultTotal = await getDB().collection(accountUserCollectionName).find().toArray()
        return { data: [...result], total: resultTotal.length }
    } catch (error) {
        throw new Error(error)
    }
}

const updateUserInformationForAdmin = async (phoneNumber, data) => {
    try {
        const updateData = {
            ...data,
            updateAt: Date.now()
        }
        const { _id, ...newUpdateData } = updateData
        const updateUser = await getDB().collection(accountUserCollectionName).findOneAndUpdate(
            { phoneNumber: phoneNumber },
            { $set: newUpdateData },
            { returnDocument: 'after' }
        )

        return updateUser.value
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


export const UserModel = {
    createNewAccountUser,
    findOneById,
    loginAccountUser,
    getInformationAccountUserForAdmin,
    getInformationAccountUser,
    getFullUserForAdmin,
    updateUserInformationForAdmin,
    getSearchUserForAdmin
}