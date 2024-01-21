import { AdminModel } from '*/models/admin.model'
import { cloneDeep } from 'lodash'

const createNewAccountAdmin = async (data) => {
    try {
        const newAccountAdmin = await AdminModel.createNewAccountAdmin(data)
        if (newAccountAdmin.message === 'Email already exists') {
            return newAccountAdmin
        }
        else {
            const getNewAccountAdmin = await AdminModel.findOneById(newAccountAdmin.insertedId.toString())
            return getNewAccountAdmin
        }
    } catch (error) {
        throw new Error(error)
    }
}

const loginAccountAdmin = async (email) => {
    try {
        const admin = await AdminModel.loginAccountAdmin(email)
        if (!admin) {
            throw new Error('not Found')
        }
        const transformAdmin = cloneDeep(admin)
        return transformAdmin
    } catch (error) {
        throw new Error(error)
    }
}

const getInformationAccountAdmin = async (adminEmail) => {
    try {
        const admin = await AdminModel.getInformationAccountAdmin(adminEmail)
        if (!admin) {
            throw new Error('not Found')
        }
        const transformAdmin = cloneDeep(admin)
        return transformAdmin
    } catch (error) {
        throw new Error(error)
    }
}

const updateAccountAdmin = async (email, data) => {
    try {
        const updatedAccountAdmin = await AdminModel.updateAccountAdmin(email, data)
        return updatedAccountAdmin
    } catch (error) {
        throw new Error(error)
    }
}

export const adminService = { 
    createNewAccountAdmin, 
    loginAccountAdmin, 
    getInformationAccountAdmin, 
    updateAccountAdmin
}