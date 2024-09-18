const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        pid:{
            type:String,
            required:true,
            unique:true
        },
        pname:{
            type:String,
            required:true   
        },
        pdescription:{
            type:String,
            required:true
        },
        pprice:{
            type:String,
            required:true
        },
        pimage:{
            type:String,
            required:true
        },
        pcategory:{
             type:String,
             required:true
        }
    }
)

const products = mongoose.model("products",productSchema)
module.exports = products