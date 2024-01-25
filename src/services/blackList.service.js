import { BlackListModel } from '*/models/blackList.model'
import { cloneDeep } from 'lodash'

const createNewBlackListAccountUser = async (data) => {
    try {
        const newAccountUser = await BlackListModel.createNewBlackListAccountUser(data)
        if (newAccountUser.message === 'Phone number already exists' || newAccountUser.message !== 'Phone number already exists') {
            return newAccountUser
        }
        else {
            const getNewAccountUser = await BlackListModel.findOneById(newAccountUser.insertedId.toString())
            return getNewAccountUser
        }
    } catch (error) {
        throw new Error(error)
    }
}

const getFullBlackListUserForAdmin = async (data) => {
    try {
        const blackList = await BlackListModel.getFullBlackListUserForAdmin(data)
        const transformUser = cloneDeep(blackList)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}

const getSearchBlackListUserForAdmin = async (data) => {
    try {
        const blackList = await BlackListModel.getSearchBlackListUserForAdmin(data)
        const transformUser = cloneDeep(blackList)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}

const updateBlackListUserInformationForAdmin = async (phoneNumber, data) => {
    try {
        const updateData = {
            ...data,
            updateAt: Date.now()
        }
        const updatedUser = await BlackListModel.updateBlackListUserInformationForAdmin(phoneNumber, updateData)
        return updatedUser
    } catch (error) {
        throw new Error(error)
    }
}

const getBlackListUserForAdmin = async (phoneNumber) => {
    try {
        const user = await BlackListModel.getBlackListUserForAdmin(phoneNumber)
        if (!user) {
            throw new Error('not Found')
        }
        const transformUser = cloneDeep(user)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}

export const blackListService = {
    createNewBlackListAccountUser,
    getFullBlackListUserForAdmin,
    getSearchBlackListUserForAdmin,
    updateBlackListUserInformationForAdmin,
    getBlackListUserForAdmin
}