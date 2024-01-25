import { orderModel } from '*/models/order.model'
import { cloneDeep } from 'lodash'

const createNewOrder = async (data) => {
    try {
        const newOrder = await orderModel.createNewOrder(data)
        const getNewOrder = await orderModel.findOneById(newOrder.insertedId.toString())
        return getNewOrder
    } catch (error) {
        throw new Error(error)
    }
}

const getFullOrderForAdmin = async (data) => {
    try {
        const order = await orderModel.getFullOrderForAdmin(data)
        const transformOrder = cloneDeep(order)
        return transformOrder
    } catch (error) {
        throw new Error(error)
    }
}

const getFullOrderInformationForAdmin = async (orderId) => {
    try {
        const order = await orderModel.getFullOrderInformationForAdmin(orderId)
        if (!order) {
            throw new Error('not Found')
        }
        const transformOrder = cloneDeep(order)
        return transformOrder
    } catch (error) {
        throw new Error(error)
    }
}

const updateOrderInformationForAdmin = async (src, data) => {
    try {
        const updateData = {
            ...data,
            updateAt: Date.now()
        }
        const updatedOrder = await orderModel.updateOrderInformationForAdmin(src, updateData)
        return updatedOrder
    } catch (error) {
        throw new Error(error)
    }
}

const getSearchOrder = async (data) => {
    try {
        const order = await orderModel.getSearchOrder(data)

        const transfromUser = cloneDeep(order)

        return transfromUser
    } catch (error) {
        throw new Error(error)
    }
}


export const orderService = { 
    createNewOrder,
    getFullOrderForAdmin,
    getFullOrderInformationForAdmin,
    updateOrderInformationForAdmin,


    getSearchOrder
}