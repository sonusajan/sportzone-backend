
const mongoose = require('mongoose')
const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('MongoDB Atlas Connection Successfull !!');
}).catch(err=>{
    console.log('MongoDB Atlas Connection failed',err);   
})