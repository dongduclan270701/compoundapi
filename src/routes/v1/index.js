import express from 'express'
import { HttpStatusCode } from '*/utils/constants'
import { adminRoutes } from './Route/admin.route'
import { userRoutes } from './Route/user.route'
import { orderRoutes } from './Route/order.route'
import { noticeRoutes } from './Route/notice.route'
import { blackListRoutes } from './Route/blackList.route'
import { ipRoutes } from './Route/ip.route'
import { websiteRoutes } from './Route/website.route'
const router = express.Router()

// GET v1/status
router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({
    status: 'OK'
}))

//User APIs

// router.use('/ip', ipRoutes)

router.use('/admin', adminRoutes)

router.use('/user', userRoutes)

router.use('/order', orderRoutes)

router.use('/notice', noticeRoutes)

router.use('/blackList', blackListRoutes)

router.use('/website', websiteRoutes)

export const apiV1 = router