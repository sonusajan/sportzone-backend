const express = require('express')
 const userController = require("../Controller/userController")
const productController = require("../Controller/productController")
const cartController = require("../Controller/cartController")
const orderController = require("../Controller/orderController")
const paymentController = require("../Controller/paymentContoller")
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

//edit User
router.put('/user/edituser/:id',jwtAuthorization,multerConfig.single('profilepicture'),userController.editUser)

//remove From Cart
router.delete('/user/clearcart/:uid',jwtAuthorization,cartController.clearCart)


//Order Products
router.post('/user/orderproducts/:uid',jwtAuthorization,orderController.order)

//
router.post('/orders',paymentController.order)

//get Orders
router.get('/admin/getOrder',orderController.getOrders)

//get user orders
router.get('/user/getOrder/:uid',orderController.getuserOrder)

//forget Password
router.post('/user/forgetpassword',userController.forgetPassword)

//reset password
router.post('/user/resetpassword',userController.resetPassword)

//show users
router.get('/admin/showusers',userController.showUsers)

module.exports = router
