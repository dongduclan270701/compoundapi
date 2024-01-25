import { ipService } from '*/services/ip.service'
import { HttpStatusCode } from '*/utils/constants'

const createNewIP = async (req, res) => {
    try {
        const data = req.body
        const result = await ipService.createNewIP(data)
        res.status(HttpStatusCode.CREATED).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}


const getSearchUserForAdmin = async (req, res) => {
    try {
        const data = req.query
        const result = await ipService.getSearchUserForAdmin(data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}


export const ipController = {
    createNewIP,
    // getSearchUserForAdmin
}