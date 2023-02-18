const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController');
const isLogin = require('../middleware/isLogin');

//GET Methods
router.get('/signup',controller.signupPage);
router.get('/verify',controller.verifyPage);
router.get('/login',controller.loginPage);
router.get('/',controller.countItem,controller.homePage);
router.get('/shop',controller.countItem,controller.shopPage);
router.get('/product/:id',controller.countItem,controller.productPage);

router.get('/orders',isLogin.userLogin,controller.countItem,controller.ordersPage);
router.get('/wishlist',isLogin.userLogin,controller.countItem,controller.wishlistPage);
router.get('/profile',isLogin.userLogin,controller.countItem,controller.profilePage);
router.get('/coupons',isLogin.userLogin,controller.countItem,controller.couponsPage);
router.get('/cart',isLogin.userLogin,controller.countItem,controller.cartPage);
router.get('/checkout',isLogin.userLogin,controller.countItem,controller.checkoutPage);
router.get('/address/add',isLogin.userLogin,controller.countItem,controller.addressPage);
router.get('/address/edit/:id',isLogin.userLogin,controller.countItem,controller.editaddressPage);
router.get('/order-success',isLogin.userLogin,controller.countItem,controller.orderSuccess);
router.get('/order-details/:id',isLogin.userLogin,controller.countItem,controller.orderDetails);
router.get("/payment",isLogin.userLogin,controller.paymentPage);
router.get("/payment-success/:orderId",isLogin.userLogin,controller.paymentSuccess);
router.get("/payment-cancel/:orderId",isLogin.userLogin,controller.paymentCancel);

router.get('/resendotp',controller.getOtp);
router.get('/logout',controller.doLogout);
router.get('/cart/add/:id',isLogin.userLogin,controller.addToCart);
router.get('/cart/delete/:id',isLogin.userLogin,controller.delFromCart);
router.get('/wishlist/add/:id',isLogin.userLogin,controller.addToWish);
router.get('/wishlist/delete/:id',isLogin.userLogin,controller.delFromWish);
router.get('/address/delete/:id',isLogin.userLogin,controller.deleteAddress);
router.get('/order-cancel/:id',isLogin.userLogin,controller.cancelOrder);


//POST Methods
router.post('/register',controller.doSignup,controller.getOtp)
router.post('/signin',controller.doLogin)
router.post('/verify-user',controller.verifyUser)
router.post('/cart/quantity',isLogin.userLogin,controller.changeItemQty);
router.post('/address/add',isLogin.userLogin,controller.addAddress);
router.post('/address/update/:id',isLogin.userLogin,controller.updateAddress);
router.post('/apply-coupon',isLogin.userLogin,controller.applyCoupon);
router.post('/place-order',isLogin.userLogin,controller.placeOrder);
router.post('/checkout-session/:orderId',isLogin.userLogin,controller.checkoutSession)
  
module.exports = router;