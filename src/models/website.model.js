import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'

const accountUserCollectionName = 'websiteCompound'

const getInformationWebsite = async () => {
    try {
        const result = await getDB().collection(accountUserCollectionName)
            .find()
            .toArray()
        const resultTotal = await getDB().collection(accountUserCollectionName).find().toArray()
        return { data: [...result], total: resultTotal.length }
    } catch (error) {
        throw new Error(error)
    }
}

const updateWebsite = async (data) => {
    try {
        const { _id, ...newUpdateData } = data
        const updateUser = await getDB().collection(accountUserCollectionName).findOneAndUpdate(
            { _id: ObjectId(data._id) },
            { $set: newUpdateData },
            { returnDocument: 'after' }
        )

        return updateUser.value
    } catch (error) {
        throw new Error(error)
    }
}


export const WebsiteModel = {
    getInformationWebsite,
    updateWebsite
}