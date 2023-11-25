const express = require('express');
const adminRouter = express.Router();

const controller = require('../controllers/adminController');
const isLogin = require('../middleware/isLogin');
const pagination = require('../middleware/pagination');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const categoryModel = require('../models/categoryModel');
const couponModel = require('../models/couponModel');
const createMulterInstance = require('../utils/fileUpload');
const subcategory = categoryModel.subcategory;

const uploadProduct = createMulterInstance('products');


/* GET Methods. */
adminRouter.get('/',isLogin.adminLogin,controller.dashBoard);
adminRouter.get('/login',controller.loginPage);
adminRouter.get('/profile',isLogin.adminLogin,controller.profilePage);
adminRouter.get('/products',isLogin.adminLogin,pagination.paginatedResults(productModel),controller.productsPage);
adminRouter.get('/product-add',isLogin.adminLogin,controller.addProductPage);
adminRouter.get('/product-edit/:id',isLogin.adminLogin,controller.editProductPage);

adminRouter.get('/categories',isLogin.adminLogin,pagination.paginatedResults(subcategory),controller.categoriesPage);
adminRouter.get('/orders',isLogin.adminLogin,pagination.paginatedResults(orderModel),controller.ordersPage);
adminRouter.get('/order-details/:id',isLogin.adminLogin,controller.orderDetails);
adminRouter.get('/coupons',isLogin.adminLogin,pagination.paginatedResults(couponModel),controller.couponsPage);
adminRouter.get('/coupon-add',isLogin.adminLogin,controller.addCouponPage);
adminRouter.get('/coupon-edit/:cpnId',isLogin.adminLogin,controller.editCouponPage);
adminRouter.get('/users',isLogin.adminLogin,pagination.paginatedResults(userModel),controller.usersPage);

adminRouter.get('/logout',controller.doLogout);
adminRouter.get('/product-flag/:id',isLogin.adminLogin,controller.flagProduct);
adminRouter.get('/user-block/:id',isLogin.adminLogin,controller.blockUser);
adminRouter.get('/user-details/:id',isLogin.adminLogin,controller.viewUser);
adminRouter.get('/category-edit/:id',isLogin.adminLogin,controller.editCategory);
adminRouter.get('/category-flag/:id',isLogin.adminLogin,controller.flagCategory);
adminRouter.get('/subcategory/:catId',isLogin.adminLogin,controller.getSubcategory);
adminRouter.get('/order-ship/:id',isLogin.adminLogin,controller.orderShip);
adminRouter.get('/order-delivery/:id',isLogin.adminLogin,controller.orderDelivery);
adminRouter.get('/order-delivered/:id',isLogin.adminLogin,controller.orderDelivered);
adminRouter.get('/order-cancel/:id',isLogin.adminLogin,controller.orderCancel);
adminRouter.get('/coupon-block/:cpnId',isLogin.adminLogin,controller.blockCoupon);
adminRouter.get('/sales-report',isLogin.adminLogin,controller.salesReport);


// POST Methods
adminRouter.post('/signin',controller.doLogin)
adminRouter.post('/add-category',controller.addCategory)
adminRouter.post('/add-subcategory',controller.addSubcategory)
adminRouter.post('/add-product',uploadProduct.array("images",5),controller.addProduct);
adminRouter.post('/edit-product/:id',controller.editProduct);
adminRouter.post('/add-coupon',controller.addCoupon);
adminRouter.post('/edit-coupon/:cpnId',controller.editCoupon);

module.exports = adminRouter;