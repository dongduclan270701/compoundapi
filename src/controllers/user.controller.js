import { userService } from '*/services/user.service'
import { HttpStatusCode } from '*/utils/constants'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createNewAccountUser = async (req, res) => {
    try {
        const data = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password, salt)
        const newData = { ...data, password: hashedPassword }
        const result = await userService.createNewAccountUser(newData)
        if (result.message === 'Phone number already exists') {
            res.status(HttpStatusCode.OK).json('Phone number already exists')
        }
        else {
            const token = jwt.sign({ _id: result._id }, process.env.TOKEN_SECRET_CUSTOMER)
            res.status(HttpStatusCode.CREATED).json(token)
        }
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const loginAccountUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.params
        const result = await userService.loginAccountUser(phoneNumber)
        if (result.message === 'Not found user') {
            res.status(HttpStatusCode.OK).json('Phone number does not exist')
        } else {
            const validPassword = await bcrypt.compare(password, result.password)
            if (!validPassword) {
                res.status(HttpStatusCode.OK).json('Incorrect password')
            } else {
                const token = jwt.sign(
                    {
                        _id: result._id,
                        username: result.username,
                        email: result.email,
                        phoneNumber: result.phoneNumber
                    },
                    process.env.TOKEN_SECRET_CUSTOMER
                )
                res.status(HttpStatusCode.OK).json({ token: token })
            }
        }
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getInformationAccountUserForAdmin = async (req, res) => {
    try {
        const { phoneNumber } = req.params
        const result = await userService.getInformationAccountUserForAdmin(phoneNumber)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getInformationAccountUser = async (req, res) => {
    try {
        const { phoneNumber } = req.params
        const result = await userService.getInformationAccountUser(phoneNumber)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const updateAccountAdmin = async (req, res) => {
    try {
        const { email } = req.params
        const result = await userService.updateAccountAdmin(email, req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

export const userController = {
    createNewAccountUser,
    loginAccountUser,
    getInformationAccountUserForAdmin,
    getInformationAccountUser,
    updateAccountAdmin
}