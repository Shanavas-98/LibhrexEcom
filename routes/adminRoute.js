const express = require('express');
const router = express.Router();

const controller = require('../controllers/adminController');
const isLogin = require('../middleware/isLogin');

/* GET Methods. */
router.get('/',isLogin.adminLogin,controller.homePage);
router.get('/login',controller.loginPage);
router.get('/profile',isLogin.adminLogin,controller.profilePage);
router.get('/products',isLogin.adminLogin,controller.productsPage);
router.get('/products/add',isLogin.adminLogin,controller.addProductPage);
router.get('/products/edit/:id',isLogin.adminLogin,controller.editProductPage);

router.get('/logout',controller.doLogout);
router.get('/products/flag/:id',isLogin.adminLogin,controller.flagProduct);
router.get('/products/details/:id',isLogin.adminLogin,controller.editProductPage);
router.get('/categories',isLogin.adminLogin,controller.categoriesPage);
router.get('/orders',isLogin.adminLogin,controller.ordersPage);
router.get('/order-details/:id',isLogin.adminLogin,controller.orderDetails);
router.get('/coupons',isLogin.adminLogin,controller.couponsPage);
router.get('/add-coupon',isLogin.adminLogin,controller.addCouponPage);


router.get('/users',isLogin.adminLogin,controller.usersPage);
router.get('/users/block/:id',isLogin.adminLogin,controller.blockUser);
router.get('/user-details/:id',isLogin.adminLogin,controller.viewUser);
router.get('/categories/edit/:id',isLogin.adminLogin,controller.editCategory);
router.get('/categories/flag/:id',isLogin.adminLogin,controller.flagCategory);
router.get('/categories/delete/:id',isLogin.adminLogin,controller.deleteCategory);
router.get('/order-ship/:id',isLogin.adminLogin,controller.orderShip);
router.get('/order-delivery/:id',isLogin.adminLogin,controller.orderDelivery);
router.get('/order-delivered/:id',isLogin.adminLogin,controller.orderDelivered);
router.get('/order-cancel/:id',isLogin.adminLogin,controller.orderCancel);
router.get('/add-coupon',isLogin.adminLogin,controller.addCouponPage);








// POST Methods
router.post('/signin',controller.doLogin)
router.post('/categories/add',controller.addCategory)
router.post('/products/add-product',controller.addProduct);
router.post('/products/edit-product/:id',controller.editProduct);
router.post('/add-coupon-form',controller.addCoupon);



module.exports = router;