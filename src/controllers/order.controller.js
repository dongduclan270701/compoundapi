import { orderService } from '*/services/order.service'
import { HttpStatusCode } from '*/utils/constants'

const createNewOrder = async (req, res) => {
    try {
        const data = req.body
        const result = await orderService.createNewOrder(data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getFullOrderForAdmin = async (req, res) => {
    try {
        const data = req.query
        const result = await orderService.getFullOrderForAdmin(data)
        res.status(HttpStatusCode.OK).json(result)

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getFullOrderInformationForAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const result = await orderService.getFullOrderInformationForAdmin(id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const updateOrderInformationForAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const result = await orderService.updateOrderInformationForAdmin(id, req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getSearchOrder = async (req, res) => {
    try {
        const data = req.query
        const result = await orderService.getSearchOrder(data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const ratingOrder = async (req, res) => {
    try {
        const { id } = req.params
        const result = await orderService.ratingOrder(id, req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

export const orderController = {
    createNewOrder,
    getFullOrderForAdmin,
    getFullOrderInformationForAdmin,
    updateOrderInformationForAdmin,


    getSearchOrder,
    ratingOrder
}