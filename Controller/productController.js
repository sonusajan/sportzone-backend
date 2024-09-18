const products = require('../Models/productSchema')

exports.addproduct =async(req,res)=>{
    
      try{
        const pimage = req.file.filename
        const{pid,pname,pdescription,pprice,pcategory}=req.body
        // console.log(pname,pdescription,pprice,pimage,pcategory); 
        if(!pid || !pname || !pdescription || !pprice || !pimage || !pcategory ){
            res.status(404).json('please fill the data')
        }else{
            const existingProduct = await products.findOne({pid})
            if(existingProduct){
              res.status(406).json('product aleady exists')
            }
            else{
             const newProduct = new products({
            pid,pname,pdescription,pprice,pimage,pcategory
 
          })
       
          await newProduct.save()
          
          res.status(200).json(newProduct)
        }
         }
      }catch(err){
        res.status(500).json('Error',err) 
      }
}





//display products

exports.getProduct=async(req,res)=>{
  try{

     const existingProducts = await products.find()
     res.status(200).json(existingProducts)
    }catch(err){
     res.status(500).json('Error',err)
  }
}




//edit products


exports.editProduct=async(req,res)=>{
  console.log("Inside edit controller");

  try{
    const {id} = req.params
    const {pid,pname,pdescription,pprice,pimage,pcategory} = req.body
    const uploadedImage = req.file?req.file.filename:pimage
  
    const updatedProduct = await products.findByIdAndUpdate({_id:id},{pid,pname,pdescription,pprice,pimage:uploadedImage,pcategory},{new:true})
    await updatedProduct.save()
    res.status(200).json(updatedProduct)

  }catch(err){
    res.status(500).json("Internal Server Error!")
    console.log(err);
  }
}

//delete product

exports.deleteProduct=async(req,res)=>{
  try{
  const {id}=req.params

  const deletedProduct = await products.findByIdAndDelete({_id:id})
  res.status(200).json(deletedProduct)
  }catch(err){
   res.status(500).json("Error")

  }
}