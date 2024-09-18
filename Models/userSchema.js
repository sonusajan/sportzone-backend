const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true
        },
         lname:{
             type:String,
             required:true
         },
        email:{
            type: String,
            required: true,
            unique: true
        },
        phone:{
            type:String,
            
        },
        address:{
            type:String,
            
        },
        password:{
            type:String,
            
        } ,
        profilepicture:{
            type:String,
        },
        role:{
            type:Number,
            default:0
        },
        googleId:{
            type:String
        }
        
}
) 

const users = mongoose.model("users",userSchema)
module.exports = users
