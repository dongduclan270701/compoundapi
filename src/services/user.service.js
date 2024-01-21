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

const updateAccountAdmin = async (email, data) => {
    try {
        const updatedAccountAdmin = await UserModel.updateAccountAdmin(email, data)
        return updatedAccountAdmin
    } catch (error) {
        throw new Error(error)
    }
}

export const userService = { 
    createNewAccountUser, 
    loginAccountUser, 
    getInformationAccountUserForAdmin,
    getInformationAccountUser, 
    updateAccountAdmin
}