const express = require('express');
const router = express.Router();

const controller = require('../controllers/adminController');
const isLogin = require('../middleware/isLogin');

/* GET Methods. */
router.get('/',isLogin.adminLogin,controller.homePage);
router.get('/login',controller.loginPage);
router.get('/profile',isLogin.adminLogin,controller.profilePage);
router.get('/products',isLogin.adminLogin,controller.productsPage);
router.get('/product-add',isLogin.adminLogin,controller.addProductPage);
router.get('/product-edit/:id',isLogin.adminLogin,controller.editProductPage);

router.get('/logout',controller.doLogout);
router.get('/product-flag/:id',isLogin.adminLogin,controller.flagProduct);
router.get('/product-details/:id',isLogin.adminLogin,controller.editProductPage);
router.get('/categories',isLogin.adminLogin,controller.categoriesPage);
router.get('/orders',isLogin.adminLogin,controller.ordersPage);
router.get('/order-details/:id',isLogin.adminLogin,controller.orderDetails);
router.get('/coupons',isLogin.adminLogin,controller.couponsPage);
router.get('/coupon-add',isLogin.adminLogin,controller.addCouponPage);
router.get('/coupon-edit/:cpnId',isLogin.adminLogin,controller.editCouponPage);

router.get('/users',isLogin.adminLogin,controller.usersPage);
router.get('/user-block/:id',isLogin.adminLogin,controller.blockUser);
router.get('/user-details/:id',isLogin.adminLogin,controller.viewUser);
router.get('/category-edit/:id',isLogin.adminLogin,controller.editCategory);
router.get('/category-flag/:id',isLogin.adminLogin,controller.flagCategory);
router.get('/order-ship/:id',isLogin.adminLogin,controller.orderShip);
router.get('/order-delivery/:id',isLogin.adminLogin,controller.orderDelivery);
router.get('/order-delivered/:id',isLogin.adminLogin,controller.orderDelivered);
router.get('/order-cancel/:id',isLogin.adminLogin,controller.orderCancel);
router.get('/delete-coupon/:cpnId',isLogin.adminLogin,controller.deleteCoupon);


// POST Methods
router.post('/signin',controller.doLogin)
router.post('/add-category',controller.addCategory)
router.post('/add-subcategory',controller.addSubcategory)
router.post('/add-product',controller.addProduct);
router.post('/edit-product/:id',controller.editProduct);
router.post('/add-coupon',controller.addCoupon);
router.post('/edit-coupon/:cpnId',controller.editCoupon);

module.exports = router;