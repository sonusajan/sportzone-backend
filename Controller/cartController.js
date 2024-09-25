const cart = require('../Models/cartSchema')


exports.addToCart = async(req,res)=>{
    try
    {

    const {uid} = req.params
    const {pid,pcount}  = req.body
    console.log(req.body);
    const existingUser = await cart.findOne({uid})

      if(existingUser){
        const item = existingUser.products.find(p=>p.pid == pid)
          
         if(item){
                item.pcount += 1
            }else{
                existingUser.products.push({pid,pcount})
            }
            await existingUser.save()
            res.status(200).json(existingUser)
         
    }
    else{
        const newCart = await cart.create ({
            uid,
            products:[{pid,pcount}]
        })
        await newCart.save()
        res.status(200).json(newCart)
    }
} 
catch(err){
       res.status(500).json('error')
       console.log(err);
       
}
}




exports.getFromCart=async(req,res)=>{
     try
       {    
        const {uid} = req.params
        const cartItems = await cart.findOne({uid}).populate('products.pid', 'pname pimage pdescription pprice ')
        if(cartItems){
            res.status(200).json(cartItems)
        }else{
            res.status(400).json('empty')
        }
   }
catch(err)
{
    res.status(500).json('error')
    console.log(err);
    
}
}

exports.removeFromCart=async(req,res)=>{
    try{
        const {uid}=req.params
        const {pid} =req.body
        const existing = await cart.findOne({uid})
        if(existing){
             console.log(existing);
             existing.products = existing.products.filter(i=>i.pid!=pid)
             existing.save()
             res.status(200).json("Item removed")
             
        }else{
            res.status(404).json("Item not found")
        }
        }catch(err){
         res.status(500).json("Error")
      
        }
}

exports.clearCart = async(req,res)=>{
    try{
      console.log('inside delete cart');
      const {uid} = req.params
      const clearItems = await cart.findOneAndDelete({uid:uid})
      console.log(clearItems);
      
      res.status(200).json(clearItems)
      
    }catch(err){
      res.status(500).json('error')
      console.log(err);
      
    }
}