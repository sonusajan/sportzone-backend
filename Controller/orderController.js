const Razorpay = require("razorpay");
const orders = require("../Models/orderSchema");
const PDFDocument = require('pdfkit')
// const { default: payments } = require("razorpay/dist/types/payments");

exports.order =async(req,res)=>{
    console.log('inside order');
    try{
         const {uid} = req.params
         const {paymentId,products,amount} = req.body
         const productDetails = new orders({
            userId:uid,
            paymentId:paymentId,
            order:products,
            amount
         }) 
         await productDetails.save()
         res.status(200).json(productDetails)
    }catch(err)
    {
        res.status(500).json('error')
        console.log(err);
        
    }
}

exports.getOrders = async(req,res)=>{
   try{
     console.log('Inside Get Orders');
    const orderedItems = await orders.find()
    if(orderedItems){
        res.status(200).json(orderedItems)
    }else{
        res.status(406).json('no orders')
    }
}catch(err)
{
    res.status(500).json('error')
    console.log(err);
    
}    
}

exports.getuserOrder = async(req,res)=>{
    try
    {
        console.log('Inside User Get Order');
        const{uid} = req.params
        const usersOrder = await orders.find({userId:uid})
        res.status(200).json(usersOrder)
    }catch(err){
        res.status(500).json('error')
        console.log(err);
        
    }
}



exports.paymentReceipt=async(req,res)=>{
    const {paymentId} = req.body
    const razorpay = new Razorpay({
        key_id : process.env.KEY_ID,
        key_secret :process.env.KEY_SECRET
    })
    try{
         const order = await orders.findOne({paymentId})
         const payment = await razorpay.payments.fetch(paymentId)
         const doc = new PDFDocument()
         
         res.setHeader('Content-Type','application/pdf')
         res.setHeader('Content-Disposition',`attachment; filename=receipt-${paymentId}.pdf`)
         
         doc.pipe(res)

         doc.fontSize(20).text('Payment Receipt', { align: 'center' });
         doc.moveDown();
         doc.fontSize(12).text(`Payment ID: ${payment.id}`);
         doc.text(`Order ID: ${order._id}`);
         doc.text(`Amount: ₹${payment.amount / 100}`);
            doc.text(`Status : ${payment.status}`)
            doc.text(`Method: ${payment.method}`);
            doc.text(`Email: ${payment.email}`);
            doc.text(`Contact: ${payment.contact}`);

            doc.end()

    }catch(err){
        res.status(500).json('error')
        console.log(err);

        
    }
}
