import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'

const accountUserCollectionName = 'blackListCompound'
const accountUserCollectionSchema = Joi.object({
    phoneNumber: Joi.string().required(),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await accountUserCollectionSchema.validateAsync(data, { abortEarly: false }) // Hiển thị đầy đủ lỗi nếu trong trường data có 2 field trở lên bị lỗi
}

const createNewBlackListAccountUser = async (data) => {
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
        const dataFindTwo = await getDB().collection(accountUserCollectionName).aggregate([
            {
                $match: {
                    phoneNumber: value.phoneNumber,
                    _destroy: true
                }
            }
        ]).toArray()
        if (dataFind.length > 0) {
            return { message: 'Phone number already exists' }
        } 
        if (dataFindTwo.length > 0) {
            const updateUser = await getDB().collection(accountUserCollectionName).findOneAndUpdate(
                { phoneNumber: value.phoneNumber },
                { $set: { ...dataFindTwo[0], _destroy: false } },
                { returnDocument: 'after' }
            )
            return updateUser.value
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

const getFullBlackListUserForAdmin = async (data) => {
    try {
        let perPage = 10
        let page = parseInt(data.count)
        const result = await getDB().collection(accountUserCollectionName)
            .aggregate([
                {
                    $match: {
                        _destroy: false
                    }
                }
            ])
            .limit(perPage)
            .skip((perPage * page) - perPage)
            .toArray()
        const resultTotal = await getDB().collection(accountUserCollectionName).find().toArray()
        return { data: [...result], total: resultTotal.length }
    } catch (error) {
        throw new Error(error)
    }
}

const getSearchBlackListUserForAdmin = async (data) => {
    try {
        let perPage = 10
        let page = parseInt(data.count)
        const result = await getDB().collection(accountUserCollectionName)
            .aggregate([
                {
                    $match: {
                        phoneNumber: { $regex: new RegExp(data.phoneNumber, 'i') },
                        _destroy: false
                    }
                }
            ])
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .toArray()
        const resultTotal = await getDB().collection(accountUserCollectionName).aggregate([
            {
                $match: {
                    phoneNumber: { $regex: new RegExp(data.phoneNumber, 'i') },
                    _destroy: false
                }
            }
        ]).toArray()
        return { data: [...result], total: resultTotal.length }
    } catch (error) {
        throw new Error(error)
    }
}

const updateBlackListUserInformationForAdmin = async (phoneNumber, data) => {
    try {
        const updateData = {
            ...data,
            updateAt: Date.now(),
            _destroy: true
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

const getBlackListUserForAdmin = async (phoneNumber) => {
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

export const BlackListModel = {
    createNewBlackListAccountUser,
    findOneById,
    getFullBlackListUserForAdmin,
    getSearchBlackListUserForAdmin,
    updateBlackListUserInformationForAdmin,
    getBlackListUserForAdmin
}