const { passwordHashing, comparePassword } = require('../helpers/authHelper')
const users = require('../Models/userSchema')
const jwt = require('jsonwebtoken')


exports.register = async(req,res)=>{
    console.log("Inside register controller");
    
    try{
        const{fname,lname,email,phone,address,password}=req.body
        if(!fname || !lname || !email || !phone || !address || !password)
        {
            res.status(401).json('Please complete the Form')
        }else{
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(406).json('Already Exisits!')
        }else{
            const hashedPassword = await passwordHashing(password)
            const newUser = new users({
                fname,lname,email,phone,address,password:hashedPassword,profilepicture:""
            })
            await newUser.save()
            res.status(200).json(newUser)
          }  } 
       
    }catch(err){
        res.status(500).json('Error',err) 
    }
}


exports.login = async(req,res)=>{
    const{email,password}= req.body
    if(!email || !password)
    {
        res.status(401).json('please enter the details')
    }else{
        const member = await users.findOne({email}) 
        if(!member){
           res.status(404).json("Incorrect email or password")
        }else{
            const match = await comparePassword(password,member.password)
            if(!match){
                res.status(404).json("Incorrect email or password")
            }else{
                const token = jwt.sign({id: member._id},"supersecretkey1234")
                res.status(200).json({member,token})
            }
        }
    }
}

exports.googleLogin = async(req,res)=>{
    try{
        const{id,fname,lname,email,profilepicture}=req.body
        console.log(id,fname,lname,email,profilepicture);
        
        if(!id || !fname || !lname || !email )
        {
            res.status(400).json('Login Failed')
        }else{
            const existingUser = await users.findOne({googleId:id})
            if(!existingUser){
                const newUser = new users({
                    fname,
                    lname,
                    email,
                    phone:'',
                    address:'',
                    password:'',
                    profilepicture, 
                    role:'',
                    googleId:id

                })
                
                await newUser.save()
                const token = jwt.sign({id: newUser._id},"supersecretkey1234")
                res.status(200).json({newUser,token})
            }   
            else{
                const token = jwt.sign({id: existingUser._id},"supersecretkey1234")
                res.status(200).json({existingUser,token})
            }
            }
                
                
            
        
    }catch(err){
        res.status(500).json('error')
        console.log(err);
        
    }
}