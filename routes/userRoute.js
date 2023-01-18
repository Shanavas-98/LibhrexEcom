const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController');
const isLogin = require('../middleware/isLogin');

//GET Methods
router.get('/',controller.Count,controller.homePage);
router.get('/signup',controller.signupPage);
router.get('/verify',controller.verifyPage);
router.get('/login',controller.loginPage);
router.get('/shop',controller.Count,controller.shopPage);
router.get('/product/:id',controller.Count,controller.productPage);

router.get('/orders',isLogin.userLogin,controller.Count,controller.ordersPage);
router.get('/wishlist',isLogin.userLogin,controller.Count,controller.wishlistPage);
router.get('/profile',isLogin.userLogin,controller.Count,controller.profilePage);
router.get('/cart',isLogin.userLogin,controller.Count,controller.cartPage);
router.get('/checkout',isLogin.userLogin,controller.Count,controller.checkoutPage);

router.get('/resendotp',controller.getOtp);
router.get('/logout',controller.doLogout);
router.get('/cart/add/:id',isLogin.userLogin,controller.addToCart);
router.get('/cart/delete/:id',isLogin.userLogin,controller.delFromCart);
router.get('/wishlist/add/:id',isLogin.userLogin,controller.addToWish);
router.get('/wishlist/delete/:id',isLogin.userLogin,controller.delFromWish);


//POST Methods
router.post('/register',controller.doSignup,controller.getOtp)
router.post('/signin',controller.doLogin)
router.post('/verify-user',controller.verifyUser)
router.post('/cart/quantity',isLogin.userLogin,controller.changeItemQty);


  
module.exports = router;