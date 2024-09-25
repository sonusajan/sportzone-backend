const orders = require("../Models/orderSchema");

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

