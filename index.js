require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./Router/router')
require('./databse/connect')

const server = express()

const port = 4000 || process.env.PORT 


server.use(cors())
server.use(express.json())
server.use(router)
server.use('/uploads',express.static('./uploads'))


server.get('/',(req,res)=>{
    res.send(`<h1>Server is running</h1>`)
})



server.listen(port,()=>{
    console.log(`Server is running on port ${port} and waiting for client requests!`);
})





