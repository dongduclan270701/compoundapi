import { blackListService } from '*/services/blackList.service'
import { HttpStatusCode } from '*/utils/constants'

const createNewBlackListAccountUser = async (req, res) => {
    try {
        const data = req.body
        const result = await blackListService.createNewBlackListAccountUser(data)
        if (result.message === 'Phone number already exists') {
            res.status(HttpStatusCode.OK).json('Phone number already exists')
        }
        else {
            res.status(HttpStatusCode.CREATED).json(result)
        }
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getFullBlackListUserForAdmin = async (req, res) => {
    try {
        const data = req.query
        const result = await blackListService.getFullBlackListUserForAdmin(data)
        res.status(HttpStatusCode.OK).json(result)

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getSearchBlackListUserForAdmin = async (req, res) => {
    try {
        const data = req.query
        const result = await blackListService.getSearchBlackListUserForAdmin(data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const updateBlackListUserInformationForAdmin = async (req, res) => {
    try {
        const { phoneNumber } = req.params
        const result = await blackListService.updateBlackListUserInformationForAdmin(phoneNumber, req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getBlackListUserForAdmin = async (req, res) => {
    try {
        const { phoneNumber } = req.params
        const result = await blackListService.getBlackListUserForAdmin(phoneNumber)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

export const blackListController = {
    createNewBlackListAccountUser,
    getFullBlackListUserForAdmin,
    getSearchBlackListUserForAdmin,
    updateBlackListUserInformationForAdmin,
    getBlackListUserForAdmin
}