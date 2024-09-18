
const bcrypt = require('bcrypt')

exports.passwordHashing = async(password)=>{
    try{
        const saltrounds = 10
        const hashedPassword = await bcrypt.hash(password,saltrounds)
        return hashedPassword
    }catch(err){
        console.log(err);
        
    }
}

exports.comparePassword = async(password,hashepassword)=>{
    const match = await bcrypt.compare(password,hashepassword)
    return match
}