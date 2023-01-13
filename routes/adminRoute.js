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

router.get('/products/flag/:id',isLogin.adminLogin,controller.flagProduct);
router.get('/products/details/:id',isLogin.adminLogin,controller.editProductPage);
router.get('/categories',isLogin.adminLogin,controller.categoriesPage);

router.get('/users',isLogin.adminLogin,controller.usersPage);
router.get('/users/block/:id',isLogin.adminLogin,controller.blockUser);
router.get('/users/details/:id',isLogin.adminLogin,controller.viewUser);
router.get('/categories/edit/:id',isLogin.adminLogin,controller.editCategory);
router.get('/categories/flag/:id',isLogin.adminLogin,controller.flagCategory);
router.get('/categories/delete/:id',isLogin.adminLogin,controller.deleteCategory);



// POST Methods
router.post('/signin',controller.doLogin)
router.post('/categories/add',controller.addCategory)
router.post('/products/add-product',controller.addProduct);
router.post('/products/edit-product/:id',controller.editProduct);


module.exports = router;