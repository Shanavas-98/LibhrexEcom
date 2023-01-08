const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController');
const isLogin = require('../middleware/isLogin');

//GET Methods
router.get('/',controller.homePage);
router.get('/signup',controller.signupPage);
router.get('/login',controller.loginPage);
router.get('/logout',controller.doLogout);
router.get('/shop',controller.shopPage);
router.get('/product',controller.productPage);
router.get('/orders',isLogin.userLogin,controller.ordersPage);
router.get('/wishlist',isLogin.userLogin,controller.wishlistPage);
router.get('/contact',controller.contactPage);
router.get('/profile',isLogin.userLogin,controller.profilePage);
router.get('/cart',isLogin.userLogin,controller.cartPage);
router.get('/checkout',isLogin.userLogin,controller.checkoutPage);


//POST Methods
router.post('/register',controller.doSignup)
router.post('/signin',controller.doLogin)
  
module.exports = router;