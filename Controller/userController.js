const { passwordHashing, comparePassword } = require('../helpers/authHelper');
const sendOtpMail = require('../helpers/otpSend');
const sendPasswordMail = require('../helpers/sendmail');
const users = require('../Models/userSchema')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')

exports.register = async(req,res)=>{
    console.log("Inside register controller");
    
    try{
        const{fname,lname,email,phone,address,password }=req.body
        
        
        if(!fname || !lname || !email || !phone || !address || !password)
        {
            res.status(406).json('Please complete the Form')
        }else{
        const existingUser = await users.findOne({email})
        if(existingUser){ 

            res.status(406).json('Already Exisits!')
        }else{

            const otp = otpGenerator.generate(6,{digits:true,upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false})
            const otpExpires = Date.now()+1*60*1000           
            await sendOtpMail(email,otp)
           
            const hashedPassword = await passwordHashing(password)

            const newUser = new users({
                fname,lname,email,phone,address,password:hashedPassword,profilepicture:"",otp:otp,otpExpires:otpExpires
            })
            await newUser.save()
            res.status(200).json(newUser)
        }}
       
    }catch(err){
        res.status(500).json('Error') 
        console.log(err);
        
    }
}


exports.otpVerify=async(req,res)=>{
    try{
      const {otp,email} = req.body
      const user = await users.findOne({email})
      if(!user){
        res.status(406).json('email not valid')
      }else{
        
        const timenow = Date.now()
       if(timenow<user.otpExpires){
        const mailotp = user.otp
         if(mailotp == otp){
            user.isVerified = true
            user.otp=null
            user.otpExpires=null
            await user.save()
            res.status(200).json('verified')
        }else{
            res.status(405).json('not matching')
        }
    }else{
        res.status(407).json('time expired')
    }
      }
      
    }catch(err){
        res.status(500).json('error')
        console.log(err);
        
    }
}


exports.resendOtp=async(req,res)=>{
    try{
        const{email} = req.body
        const user = await users.findOne({email})
        const current = Date.now()
        if(user.otpExpires < current){
            const otp = otpGenerator.generate(6,{digits:true,upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false})
            const otpExpires = Date.now()+10*60*1000           
            await sendOtpMail(email,otp)
            user.otp = otp
            user.otpExpires = otpExpires
            await user.save()
            res.status(200).json(user)
        }else{
            res.status(406).json('not expired')
        }

    }catch(err){
        res.status(500).json('error')
        console.log(err);
        
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
        const{aud,given_name,family_name,email,picture}=req.body
        // console.log(jti,given_name,
            // family_name,email,picture);
        
        if(!aud || !given_name || !family_name || !email)
        {
            res.status(400).json('Login Failed')
        }else{
            const existingUser = await users.findOne({googleId:aud})
            if(!existingUser){
                const newUser = new users({
                    fname:given_name,
                    lname:family_name,
                    email,
                    phone:'',
                    address:'',
                    password:'',
                    profilepicture:picture, 
                    role:'',
                    googleId:aud

                })
                
                await newUser.save()
                const token = jwt.sign({id: newUser._id},"supersecretkey1234")
                res.status(200).json({user:newUser,token})
            }   
            else{
                const token = jwt.sign({id: existingUser._id},"supersecretkey1234")
                res.status(200).json({user:existingUser,token})
            }
            }
                
                
            
        
    }catch(err){
        res.status(500).json('error')
        console.log(err);
        
    }
}



exports.editUser = async(req,res)=>{

  try
    {    const {id} = req.params
    const {fname,lname,address,phone,profilepicture} = req.body
     const updateImage = req.file? req.file.filename:profilepicture

    const updatedUser = await users.findByIdAndUpdate({_id:id},{fname,
        lname,
        address,
        phone,
        profilepicture:updateImage
        },{new:true})

        await updatedUser.save()
        res.status(200).json(updatedUser)
    }
    catch(err){
       res.status(500).json('error')
       console.log(err);
       
    }
}



exports.forgetPassword = async(req,res)=>{
    const {email} = req.body

    try{
    const user = await users.findOne({email})
    if(!user){
        res.status(404).json("User not found")
    }else{
       const resetToken = jwt.sign({id:user._id},'superscretkey1234',{expiresIn:'30m'})
       const baseURL = process.env. BASE_URL
       const resetLink = `${baseURL}/ResetPassword/${resetToken}`

       await sendPasswordMail(email,resetLink,user.fname)
       res.status(200).json("Email sent successfully")
    }
   }catch(err){
    res.status(500).json("Internal Server Error!")
    console.log(err);
}
}




exports.resetPassword=async(req,res)=>{
    console.log('inside reset password');
    
    const {token,password} = req.body
     try{
     
      const decode = jwt.verify(token,'superscretkey1234')
      console.log(decode);
      
      const user = await users.findById(decode.id)
      if(!user){
        res.status(404).json('user not found')
      }else{
        const hashedPassword = await passwordHashing(password)
        user.password = hashedPassword
        await user.save()
        res.status(200).json(user)
      }
     }catch(err){
        res.status(500).json('internal server error')
        console.log(err);
        
     }
}



exports.showUsers=async(req,res)=>{
    console.log('inside show users');

    try{
      const user = await users.find({role:{$ne:1}})
      if(user == 0 ){
        res.status(404).json('users not found')
      }else{

        res.status(200).json(user)
      }
    }catch(err){
         res.status(500).json('error')
         console.log(err);
         
    }
    
}