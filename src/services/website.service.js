import { WebsiteModel } from '*/models/website.model'
import { cloneDeep } from 'lodash'

const getInformationWebsite = async () => {
    try {
        const website = await WebsiteModel.getInformationWebsite()
        const transformUser = cloneDeep(website)
        return transformUser
    } catch (error) {
        throw new Error(error)
    }
}

const updateWebsite = async (data) => {
    try {
        const updatedUser = await WebsiteModel.updateWebsite(data)
        return updatedUser
    } catch (error) {
        throw new Error(error)
    }
}

export const websiteService = { 
    getInformationWebsite,
    updateWebsite
}