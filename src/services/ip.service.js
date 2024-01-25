import { IpModel } from '*/models/ip.model'
import { cloneDeep } from 'lodash'

const createNewIP = async (data) => {
    try {
        const newAccountIP = await IpModel.createNewIP(data)
        if (newAccountIP.message === 'Phone number already exists') {
            // const getNewAccountIP = await IpModel.findOneById(newAccountIP.insertedId.toString())
            // return getNewAccountIP
        }
        else {
            const getNewAccountIP = await IpModel.findOneById(newAccountIP.insertedId.toString())
            return getNewAccountIP
        }
    } catch (error) {
        throw new Error(error)
    }
}

const getSearchIPForAdmin = async (data) => {
    try {
        const user = await IpModel.getSearchIPForAdmin(data)
        const transformIP = cloneDeep(user)
        return transformIP
    } catch (error) {
        throw new Error(error)
    }
}

export const ipService = { 
    createNewIP
    // getSearchIPForAdmin
}