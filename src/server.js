// import express from 'express'
// import { connectDB } from '*/config/mongodb.js'
// import { env } from '*/config/environment'
// import { apiV1 } from '*/routes/v1'
// const axios = require('axios');
// const cors = require('cors')
// import { corsOptions } from '*/config/cors.js'
// const expressip = require('express-ip');

// connectDB()
//     .then(() => console.log('Connected MongoDB successfully to server'))
//     .then(() => bootServer())
//     .catch(error => {
//         console.error(error)
//         process.exit(1)
//     })
// const bootServer = () => {
//     const app = express()

//     app.use(cors(corsOptions))
//     app.use(expressip().getIpInfoMiddleware);
//     // Enable req.body data
//     app.use(express.json())
//     // const accessLog = [];

//     // app.get('/', (req, res) => {
//     //     const clientIP = req.ip;
//     //     accessLog.push(clientIP)

//     //     res.send(`Hello, you've accessed this page ${accessLog.length} times.`)
//     // });

//     // app.get('/ip-list', (req, res) => {
//     //     res.json({ ipList: accessLog });
//     // });

//     // const PORT = process.env.PORT || 3001;
//     // app.listen(PORT, () => {
//     //     console.log(`Server is running on port ${PORT}`);
//     // });
//     // Use APIs v1
//     // app.use('/v1', apiV1)

//     // app.listen(env.APP_PORT, env.APP_HOST, () => {
//     //     console.log(`Hello KassDev, I'm running at ${env.APP_HOST}:${env.APP_PORT}/`)
//     // })
//     app.use(async (req, res, next) => {
//         console.log(1)
//         try {
//             const clientIP = req.ip || req.connection.remoteAddress;
//             const ipInfoResponse = await axios.get(`https://ipinfo.io/${clientIP}?token=597ca5cf40baef`);
//             const { ip, loc } = ipInfoResponse.data;

//             console.log(`IP: ${ip} | Location: ${loc}`)
//         } catch (error) {
//             console.error('Error fetching IP info', error);
//             next();
//         }
//     });
// }


const express = require('express');
const axios = require('axios');
const requestIp = require('request-ip');
const app = express();

app.use(express.json());
app.use(requestIp.mw());

const ipList = [];

app.use('/ip', async (req, res, next) => {
  try {
    const clientIP = req.clientIp; // Lấy địa chỉ IP từ middleware
    
    if (!clientIP) {
      return res.status(400).json({ error: 'Unable to get client IP' });
    }

    const ipInfoResponse = await axios.get(`https://ipinfo.io/${clientIP}?token=YOUR_IPINFO_API_TOKEN`);
    const { ip, loc } = ipInfoResponse.data;

    console.log(`IP: ${ip} | Location: ${loc}`);
    
    // Thêm thông tin IP vào danh sách
    ipList.push({ ip, location: loc });
    
    res.json(ipList);
  } catch (error) {
    console.error('Error fetching IP info', error);
    next();
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
