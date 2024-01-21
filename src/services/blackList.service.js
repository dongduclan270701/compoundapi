import { noticeModel } from '*/models/notice.model'
import { cloneDeep } from 'lodash'

const createNewNotice = async (data) => {
    try {
        const newNotice = await noticeModel.createNewNotice(data)
        const getNewNotice = await noticeModel.findOneById(newNotice.insertedId.toString())
        return getNewNotice
    } catch (error) {
        throw new Error(error)
    }
}

const getFullNotice = async () => {
    try {
        const notice = await noticeModel.getFullNotice()
        const transformNotice = cloneDeep(notice)
        return transformNotice
    } catch (error) {
        throw new Error(error)
    }
}

const getUpdateNotice = async (id) => {
    try {
        const notice = await noticeModel.getUpdateNotice(id)
        const transformNotice = cloneDeep(notice)
        return transformNotice
    } catch (error) {
        throw new Error(error)
    }
}

export const noticeService = { 
    createNewNotice, 
    getFullNotice,
    getUpdateNotice
}