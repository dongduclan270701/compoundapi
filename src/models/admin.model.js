import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'

const accountAdminCollectionName = 'adminCompound'
const accountAdminCollectionSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    email: Joi.string().required(),
    role: Joi.string().required(),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    status: Joi.boolean().default(true),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await accountAdminCollectionSchema.validateAsync(data, { abortEarly: false }) // Hiển thị đầy đủ lỗi nếu trong trường data có 2 field trở lên bị lỗi
}

const createNewAccountAdmin = async (data) => {
    try {
        const value = await validateSchema(data)
        const dataFind = await getDB().collection(accountAdminCollectionName).aggregate([
            {
                $match: {
                    email: value.email,
                    _destroy: false
                }
            }
        ]).toArray()
        if (dataFind.length > 0) {
            return { message: 'Email already exists' }
        } else {
            const result = await getDB().collection(accountAdminCollectionName).insertOne(value)
            return result
        }
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (id) => {
    try {
        const result = await getDB().collection(accountAdminCollectionName).findOne({ _id: ObjectId(id) })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const loginAccountAdmin = async (email) => {
    try {
        const result = await getDB().collection(accountAdminCollectionName).aggregate([
            {
                $match: {
                    email: email,
                    _destroy: false
                }
            }
        ]).toArray()
        return result[0] || { message: 'Not found employee' }
    } catch (error) {
        throw new Error(error)
    }
}

const getInformationAccountAdmin = async (adminEmail) => {
    try {
        const result = await getDB().collection(accountAdminCollectionName).aggregate([
            {
                $match: {
                    email: adminEmail,
                    _destroy: false
                }
            }
        ]).toArray()
        return result[0] || { message: 'Not found account admin' }
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
        const updateAccountAdmin = await getDB().collection(accountAdminCollectionName).findOneAndUpdate(
            { email: email },
            { $set: newData },
            { returnDocument: 'after' }
        )
        return updateAccountAdmin.value
    } catch (error) {
        throw new Error(error)
    }
}

export const AdminModel = {
    createNewAccountAdmin,
    findOneById,
    loginAccountAdmin,
    getInformationAccountAdmin,
    updateAccountAdmin
}