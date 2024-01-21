import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'

const accountUserCollectionName = 'userCompound'
const accountUserCollectionSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().required(),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    status: Joi.boolean().default(true),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await accountUserCollectionSchema.validateAsync(data, { abortEarly: false }) // Hiển thị đầy đủ lỗi nếu trong trường data có 2 field trở lên bị lỗi
}

const createNewAccountUser = async (data) => {
    try {
        const value = await validateSchema(data)
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

const updateAccountAdmin = async (email, data) => {
    try {
        const updateData = {
            ...data,
            updatedAt: Date.now()
        }
        const { _id, ...newData } = updateData
        const updateAccountAdmin = await getDB().collection(accountUserCollectionName).findOneAndUpdate(
            { email: email },
            { $set: newData },
            { returnDocument: 'after' }
        )
        return updateAccountAdmin.value
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
    updateAccountAdmin
}