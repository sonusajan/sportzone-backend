const nodemailer = require('nodemailer')

const sendPasswordMail=async(email,link,username)=>{
    var transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.SENDER_EMAIL,
            pass:process.env.SENDER_EMAIL_PASSWORD
        }
    });
    try{
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Reset password',
            html:`<p>Hi ${username},</p>
            <b>your password reset link is <a href=${link}>link</a></b>`
        }
    

    transporter.sendMail(mailOptions,function(err,info){
        if(err)
            console.log(err);
        else{
            console.log("email sent successfully");
        }
            
      })
}
catch (error) {
    console.log('Error sending email: ', error);
    throw error;
    }
};

module.exports = sendPasswordMail
    