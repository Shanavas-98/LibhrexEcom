const express = require('express')
const userRouter = express.Router()

const controller = require('../controllers/userController');
const isLogin = require('../middleware/isLogin');
const pagination = require('../middleware/pagination');
const couponModel = require('../models/couponModel');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

//GET Methods
userRouter.get('/signup',controller.signupPage);
userRouter.get('/forgot-password',controller.forgotPage);
userRouter.get('/login',controller.loginPage);
userRouter.get('/',controller.countItem,pagination.paginatedResults(productModel),controller.homePage);
userRouter.get('/shop',controller.countItem,pagination.paginatedResults(productModel),controller.shopPage);
userRouter.get('/product/:id',controller.countItem,controller.productPage);

userRouter.get('/reset-password',isLogin.userLogin,controller.countItem,controller.resetPage)
userRouter.get('/orders',isLogin.userLogin,controller.countItem,pagination.paginatedResults(orderModel),controller.ordersPage);
userRouter.get('/wishlist',isLogin.userLogin,controller.countItem,controller.wishlistPage);
userRouter.get('/profile',isLogin.userLogin,controller.countItem,controller.profilePage);
userRouter.get('/coupons',isLogin.userLogin,controller.countItem,pagination.paginatedResults(couponModel),controller.couponsPage);
userRouter.get('/cart',isLogin.userLogin,controller.countItem,controller.cartPage);
userRouter.get('/checkout',isLogin.userLogin,controller.countItem,controller.checkoutPage);
userRouter.get('/address-add',isLogin.userLogin,controller.countItem,controller.addressPage);
userRouter.get('/address-edit/:id',isLogin.userLogin,controller.countItem,controller.editaddressPage);
userRouter.get('/order-success',isLogin.userLogin,controller.countItem,controller.orderSuccess);
userRouter.get('/order-details/:id',isLogin.userLogin,controller.countItem,controller.orderDetails);
userRouter.get('/payment',isLogin.userLogin,controller.paymentPage);
userRouter.get('/payment-success/:orderId',isLogin.userLogin,controller.paymentSuccess);
userRouter.get('/payment-cancel/:orderId',isLogin.userLogin,controller.paymentCancel);

userRouter.get('/logout',controller.doLogout);
userRouter.get('/search',controller.countItem,controller.searchProduct);
userRouter.get('/subcategory/:catId',controller.countItem,controller.getSubcategory);
userRouter.get('/cart-add/:id',controller.addToCart);
userRouter.get('/cart-delete/:id',isLogin.userLogin,controller.delFromCart);
userRouter.get('/wishlist-add/:id',controller.addToWish);
userRouter.get('/wishlist-delete/:id',isLogin.userLogin,controller.delFromWish);
userRouter.get('/address-delete/:id',isLogin.userLogin,controller.deleteAddress);
userRouter.get('/order-cancel/:id',isLogin.userLogin,controller.cancelOrder);


//POST Methods
userRouter.post('/register',controller.doSignup);
userRouter.post('/send-otp',controller.sendOtp);
userRouter.post('/signin',controller.doLogin);
userRouter.post('/reset-password',controller.resetPassword);
userRouter.post('/filter',controller.filterProduct);

userRouter.post('/change-password',isLogin.userLogin,controller.changePassword);
userRouter.post('/cart-qty',isLogin.userLogin,controller.changeItemQty);
userRouter.post('/address-add',isLogin.userLogin,controller.addAddress);
userRouter.post('/address-update/:id',isLogin.userLogin,controller.updateAddress);
userRouter.post('/apply-coupon',isLogin.userLogin,controller.applyCoupon);
userRouter.post('/place-order',isLogin.userLogin,controller.placeOrder);
userRouter.post('/checkout-session',isLogin.userLogin,controller.checkoutSession)
  
module.exports = userRouter;