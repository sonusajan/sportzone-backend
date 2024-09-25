const Razorpay = require('razorpay')

exports.order=async(req,res)=>{
    const razorpay = new Razorpay({
       key_id : process.env.KEY_ID,
       key_secret :process.env.KEY_SECRET
   })


const options = {
   amount : req.body.amount,
   currency : req.body.currency,
   receipt: "receipt#1",
   payment_capture:1
}

try{
   const response = await razorpay.orders.create(options)
   res.status(200).json(response)
}

catch(err){
res.status(500).json('internal server error')
console.log(err);


}
}