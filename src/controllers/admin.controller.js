import { adminService } from '*/services/admin.service'
import { HttpStatusCode } from '*/utils/constants'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createNewAccountAdmin = async (req, res) => {
    try {
        const data = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password, salt)
        const newData = { ...data, password: hashedPassword }
        const result = await adminService.createNewAccountAdmin(newData)
        if (result.message === 'Email already exists') {
            res.status(HttpStatusCode.OK).json('Email already exists')
        }
        else {
            const token = jwt.sign({ _id: result._id, role: result.role }, process.env.TOKEN_SECRET_ADMIN)
            res.status(HttpStatusCode.CREATED).json(token)
        }
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const loginAccountAdmin = async (req, res) => {
    try {
        const { email, password } = req.params
        const result = await adminService.loginAccountAdmin(email)
        if (result.message === 'Not found employee') {
            res.status(HttpStatusCode.OK).json('Email does not exist')
        } else {
            const validPassword = await bcrypt.compare(password, result.password)
            if (!validPassword) {
                res.status(HttpStatusCode.OK).json('Incorrect password')
            } else {
                const token = jwt.sign(
                    {
                        _id: result._id,
                        role: result.role,
                        username: result.username,
                        email: result.email
                    },
                    process.env.TOKEN_SECRET_ADMIN
                )
                res.status(HttpStatusCode.OK).json({ token: token, role: result.role })
            }
        }
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

const getInformationAccountAdmin = async (req, res) => {
    try {
        const { email } = req.params
        const result = await adminService.getInformationAccountAdmin(email)
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
        const result = await adminService.updateAccountAdmin(email, req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: error.message
        })
    }
}

export const adminController = {
    createNewAccountAdmin,
    loginAccountAdmin,
    getInformationAccountAdmin,
    updateAccountAdmin
}