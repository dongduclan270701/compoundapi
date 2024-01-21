import { noticeService } from '*/services/notice.service'
import { HttpStatusCode } from '*/utils/constants'

const createNewNotice = async (req, res) => {
    try {
        const data = req.body
        const result = await noticeService.createNewNotice(data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getFullNotice = async (req, res) => {
    try {
        const result = await noticeService.getFullNotice()
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getUpdateNotice = async (req, res) => {
    try {
        const result = await noticeService.getUpdateNotice(req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

export const noticeController = { 
    createNewNotice,
    getFullNotice,
    getUpdateNotice
}