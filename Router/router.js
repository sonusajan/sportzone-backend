const express = require('express')
 const userController = require("../Controller/userController")
const productController = require("../Controller/productController")
const cartController = require("../Controller/cartController")
const jwtAuthorization = require('../Middleware/jwtMiddleware')
const multerConfig = require('../Middleware/multerMiddleware')

 const router = new express.Router()

 //registration
 router.post('/user/register',userController.register)
 
 //login
 router.post('/user/login',userController.login)

 //add product
 router.post('/admin/addproduct',jwtAuthorization,multerConfig.single('pimage'),productController.addproduct)

 //display product
 router.get('/admin/getproducts',productController.getProduct)

 //edit product
 router.put('/admin/editproduct/:id',jwtAuthorization,multerConfig.single('pimage'),productController.editProduct)

//delete product
router.delete('/admin/deleteproducts/:id',jwtAuthorization,productController.deleteProduct)

//addto Cart
router.post('/user/addtocart/:uid',jwtAuthorization,cartController.addToCart)


//get From Cart
router.get('/user/getfromcart/:uid',cartController.getFromCart)

//remove from cart
router.post('/user/removefromcart/:uid',cartController.removeFromCart)

//googlelogin
router.post('/user/googlelogin',userController.googleLogin)

module.exports = router
