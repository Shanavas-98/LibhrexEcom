const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController');
const isLogin = require('../middleware/isLogin');

//GET Methods
router.get('/',controller.homePage);
router.get('/signup',controller.signupPage);
router.get('/verify',controller.verifyPage);
router.get('/login',controller.loginPage);
router.get('/logout',controller.doLogout);
router.get('/shop',controller.shopPage);
router.get('/product/:id',controller.productPage);
router.get('/contact',controller.contactPage);

router.get('/orders',isLogin.userLogin,controller.ordersPage);
router.get('/wishlist',isLogin.userLogin,controller.wishlistPage);
router.get('/profile',isLogin.userLogin,controller.profilePage);
router.get('/cart',isLogin.userLogin,controller.cartPage);
router.get('/checkout',isLogin.userLogin,controller.checkoutPage);

router.get('/resendotp',controller.getOtp);
router.get('/cart/add/:id',isLogin.userLogin,controller.addToCart);
router.get('/cart/delete/:id',isLogin.userLogin,controller.delFromCart);
router.get('/wishlist/add/:id',isLogin.userLogin,controller.addToWish);
router.get('/wishlist/delete/:id',isLogin.userLogin,controller.delFromWish);




//POST Methods
router.post('/register',controller.doSignup,controller.getOtp)
router.post('/signin',controller.doLogin)
router.post('/verify-user',controller.verifyUser)

  
module.exports = router;