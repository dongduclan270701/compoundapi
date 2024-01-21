import { WHITELIST_DOMAINS } from '*/utils/constants'
export const corsOptions = {
    function (req, callback) {
        // if (WHITELIST_DOMAINS.indexOf(origin) !== -1) {
        //     callback(null, true)
        // } else {
        //     callback(new Error('Not allowed by CORS'))
        // }
        var corsOptions
        if (WHITELIST_DOMAINS.indexOf(req.header('Origin')) !== -1) {
            corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
        } else {
            corsOptions = { origin: false } // disable CORS for this request
        }
        callback(null, corsOptions)
    }
}