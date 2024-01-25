import { websiteService } from '*/services/website.service'
import { HttpStatusCode } from '*/utils/constants'

const getInformationWebsite = async (req, res) => {
    try {
        const result = await websiteService.getInformationWebsite()
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const updateWebsite = async (req, res) => {
    try {
        const data = req.body
        const result = await websiteService.updateWebsite(data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

export const websiteController = {
    getInformationWebsite,
    updateWebsite
}