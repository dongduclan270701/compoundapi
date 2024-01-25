import { UserModel } from '*/models/user.model'
import { cloneDeep } from 'lodash'

const createNewAccountUser = async (data) => {
    try {
        const newAccountUser = await UserModel.createNewAccountUser(data)
        if (newAccountUser.message === 'Phone number already exists') {
            return newAccountUser
        }
        else {
            const getNewAccountUser = await UserModel.findOneById(newAccountUser.insertedId.toString())
            return getNewAccountUser
        }
    } catch (error) {
        throw new Error(error)
    }
}

const loginAccountUser = async (phoneNumber) => {
    try {
        const user = await UserModel.loginAccountUser(phoneNumber)
        if (!user) {
            throw new Error('not Found')
        }
        const transformUser = cloneDeep(user)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}

const getInformationAccountUserForAdmin = async (phoneNumber) => {
    try {
        const user = await UserModel.getInformationAccountUserForAdmin(phoneNumber)
        if (!user) {
            throw new Error('not Found')
        }
        const transformUser = cloneDeep(user)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}

const getInformationAccountUser = async (phoneNumber) => {
    try {
        const user = await UserModel.getInformationAccountUser(phoneNumber)
        if (!user) {
            throw new Error('not Found')
        }
        const transformUser = cloneDeep(user)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}
const getFullUserForAdmin = async (data) => {
    try {
        const user = await UserModel.getFullUserForAdmin(data)
        const transformUser = cloneDeep(user)
        return transformUser
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
        const updatedUser = await UserModel.updateUserInformationForAdmin(phoneNumber, updateData)
        return updatedUser
    } catch (error) {
        throw new Error(error)
    }
}

const getFullBlackListUserForAdmin = async (data) => {
    try {
        const user = await UserModel.getFullBlackListUserForAdmin(data)
        const transformUser = cloneDeep(user)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}

const getSearchUserForAdmin = async (data) => {
    try {
        const user = await UserModel.getSearchUserForAdmin(data)
        const transformUser = cloneDeep(user)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}

const getSearchBlackListUserForAdmin = async (data) => {
    try {
        const user = await UserModel.getSearchBlackListUserForAdmin(data)
        const transformUser = cloneDeep(user)
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
        const updatedUser = await UserModel.updateBlackListUserInformationForAdmin(phoneNumber, updateData)
        return updatedUser
    } catch (error) {
        throw new Error(error)
    }
}

export const userService = { 
    createNewAccountUser, 
    loginAccountUser, 
    getInformationAccountUserForAdmin,
    getInformationAccountUser,
    getFullUserForAdmin,
    updateUserInformationForAdmin,
    getFullBlackListUserForAdmin,
    getSearchUserForAdmin,
    getSearchBlackListUserForAdmin,
    updateBlackListUserInformationForAdmin
}