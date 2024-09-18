const mongoose = require('mongoose')
const users = require('./userSchema')
const products = require('./productSchema')

const cartSchema = new mongoose.Schema(
    {
        uid:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'users'
        },

        products:[
            {   
               
                pid:{
                   type:mongoose.Schema.Types.ObjectId,
                   required:true,
                   ref:'products'
                },
                pcount:{
                    type:Number,
                    required:true
                }
            }
        ],
       
      
    }

)

const cart = mongoose.model("cart",cartSchema)
module.exports = cart