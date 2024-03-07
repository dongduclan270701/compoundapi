import Joi from 'joi'
import { getDB } from '*/config/mongodb.js'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'
// Define Board collection
const orderName = 'orderCompound'
const orderSchema = Joi.object({
    pick_up_location: Joi.string().required(),
    destination: Joi.string().required(),
    note: Joi.string().required(),
    username: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    status: Joi.string(),
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(null),
    reasonCancel: Joi.string().default(''),
    _destroy: Joi.boolean().default(false),
    statusReview: Joi.object().default({
        status: false,
        comment: []
    }),
    orderId: Joi.string(),
    createDate: Joi.object({
        time: Joi.string().required(),
        date: Joi.string().required()
    })
})

const validateSchema = async (data) => {
    return await orderSchema.validateAsync(data, { abortEarly: false }) // Hiển thị đầy đủ lỗi nếu trong trường data có 2 field trở lên bị lỗi
}

const createNewOrder = async (data) => {
    try {
        const id = crypto.randomBytes(12).toString('hex')
        const newData = {
            ...data,
            orderId: id,
            status: 'Chờ xác nhận'
        }

        const updateProduct = await getDB().collection('userCompound').findOneAndUpdate(
            { phoneNumber: newData.phoneNumber },
            { $inc: { totalOrder: 1 } },
            { returnDocument: 'after' }
        )
        const value = await validateSchema(newData)
        const result = await getDB().collection(orderName).insertOne(value)
        const myOAuth2Client = new OAuth2Client(
            process.env.GOOGLE_MAILER_CLIENT_ID,
            process.env.GOOGLE_MAILER_CLIENT_SECRET
        )
        myOAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
        })
        const myAccessTokenObject = await myOAuth2Client.getAccessToken()
        const myAccessToken = myAccessTokenObject?.token

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.ADMIN_EMAIL_ADDRESS,
                clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken: myAccessToken
            }
        })
        const info = await transporter.sendMail({
            from: '"Thông báo đặt xe ghép!" <dongduclan270701@gmail.com>', // sender address
            to: 'ducanhdong.2411@gmail.com, Huyenhuyen.929215@gmail.com, dongduclan270701@gmail.com', // list of receivers
            subject: `Đơn đặt hàng mới từ ${newData.username}`, // Subject line
            text: `${newData.username} - ${newData.phoneNumber} - ${newData.pick_up_location} - ${newData.destination} - ${newData.note} - ${newData.createDate.time} ${newData.createDate.date}`, // plain text body
            html: `
            <h3>Thông báo đặt xe mới!</h3>

            <div>Tên khách hàng: <b>${newData.username}</b></div> 
            <div>Số điện thoại: <b>${newData.phoneNumber}</b></div>  
            <div>Địa điểm đón: <b>${newData.pick_up_location}</b></div> 
            <div>Địa điểm đến: <b>${newData.destination}</b></div> 
            <div>Ghi chú: <b>${newData.note}</b></div> 
            <div>Ngày tạo đơn: <b>${newData.createDate.time} ${newData.createDate.date}</b></div>

            <h3>Have a good day!</h3>
            ` // html body
        });

        return result
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (id) => {
    try {
        const result = await getDB().collection(orderName).findOne({ _id: ObjectId(id) })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getFullOrderForAdmin = async (data) => {
    try {
        let perPage = 10
        let page = parseInt(data.count)
        const result = await getDB().collection(orderName)
            .find({})
            .sort({
                'createDate.date': -1,
                'createDate.time': -1
            })
            .limit(perPage)
            .skip((perPage * page) - perPage)
            .toArray()
        const resultTotal = await getDB().collection(orderName).find().toArray()
        return { data: [...result], total: resultTotal.length }
    } catch (error) {
        throw new Error(error)
    }
}

const getFullOrderInformationForAdmin = async (id) => {
    try {
        const result = await getDB().collection(orderName).aggregate([
            {
                $match: {
                    orderId: id,
                    _destroy: false
                }
            }
        ]).toArray()
        return result[0] || { message: 'Not found order' }
    } catch (error) {
        throw new Error(error)
    }
}

const updateOrderInformationForAdmin = async (id, data) => {
    try {
        const updateData = {
            ...data,
            updateAt: Date.now()
        }
        const { _id, ...newUpdateData } = updateData
        const updateOrder = await getDB().collection(orderName).findOneAndUpdate(
            { orderId: id },
            { $set: newUpdateData },
            { returnDocument: 'after' }
        )

        return updateOrder.value
    } catch (error) {
        throw new Error(error)
    }
}

const getSearchOrder = async (data) => {
    try {
        let perPage = 10
        let page = parseInt(data.count)
        const result = await getDB().collection(orderName)
            .aggregate([
                {
                    $match: {
                        status: { $regex: new RegExp(`${data.status === 'Chọn trạng thái' ? '' : data.status}`) },
                        phoneNumber: { $regex: new RegExp(`${data.phoneNumber}`) },
                        _destroy: false
                    }
                }
            ])
            .sort({
                'createDate.date': -1,
                'createDate.time': -1
            })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .toArray()
        const resultTotal = await getDB().collection(orderName).aggregate([
            {
                $match: {
                    status: { $regex: new RegExp(`${data.status === 'Chọn trạng thái' ? '' : data.status}`) },
                    phoneNumber: { $regex: new RegExp(`${data.phoneNumber}`) },
                    _destroy: false
                }
            }
        ]).toArray()
        return { data: [...result], total: resultTotal.length }
    } catch (error) {
        throw new Error(error)
    }
}
export const orderModel = {
    createNewOrder,
    getFullOrderForAdmin,
    getFullOrderInformationForAdmin,
    updateOrderInformationForAdmin,
    findOneById,
    getSearchOrder
}