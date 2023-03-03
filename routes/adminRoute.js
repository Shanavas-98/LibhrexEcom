const express = require('express');
const router = express.Router();

const controller = require('../controllers/adminController');
const isLogin = require('../middleware/isLogin');
const pagination = require('../middleware/pagination');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const categoryModel = require('../models/categoryModel');
const couponModel = require('../models/couponModel');
const category = categoryModel.category;



/* GET Methods. */
router.get('/',isLogin.adminLogin,controller.dashBoard);
router.get('/login',controller.loginPage);
router.get('/profile',isLogin.adminLogin,controller.profilePage);
router.get('/products',isLogin.adminLogin,pagination.paginatedResults(productModel),controller.productsPage);
router.get('/product-add',isLogin.adminLogin,controller.addProductPage);
router.get('/product-edit/:id',isLogin.adminLogin,controller.editProductPage);

router.get('/categories',isLogin.adminLogin,pagination.paginatedResults(category),controller.categoriesPage);
router.get('/orders',isLogin.adminLogin,pagination.paginatedResults(orderModel),controller.ordersPage);
router.get('/order-details/:id',isLogin.adminLogin,controller.orderDetails);
router.get('/coupons',isLogin.adminLogin,pagination.paginatedResults(couponModel),controller.couponsPage);
router.get('/coupon-add',isLogin.adminLogin,controller.addCouponPage);
router.get('/coupon-edit/:cpnId',isLogin.adminLogin,controller.editCouponPage);
router.get('/users',isLogin.adminLogin,pagination.paginatedResults(userModel),controller.usersPage);

router.get('/logout',controller.doLogout);
router.get('/product-flag/:id',isLogin.adminLogin,controller.flagProduct);
router.get('/user-block/:id',isLogin.adminLogin,controller.blockUser);
router.get('/user-details/:id',isLogin.adminLogin,controller.viewUser);
router.get('/category-edit/:id',isLogin.adminLogin,controller.editCategory);
router.get('/category-flag/:id',isLogin.adminLogin,controller.flagCategory);
router.get('/order-ship/:id',isLogin.adminLogin,controller.orderShip);
router.get('/order-delivery/:id',isLogin.adminLogin,controller.orderDelivery);
router.get('/order-delivered/:id',isLogin.adminLogin,controller.orderDelivered);
router.get('/order-cancel/:id',isLogin.adminLogin,controller.orderCancel);
router.get('/coupon-block/:cpnId',isLogin.adminLogin,controller.blockCoupon);
router.get('/sales-report',isLogin.adminLogin,controller.salesReport);


// POST Methods
router.post('/signin',controller.doLogin)
router.post('/add-category',controller.addCategory)
router.post('/add-subcategory',controller.addSubcategory)
router.post('/add-product',controller.addProduct);
router.post('/edit-product/:id',controller.editProduct);
router.post('/add-coupon',controller.addCoupon);
router.post('/edit-coupon/:cpnId',controller.editCoupon);

module.exports = router;