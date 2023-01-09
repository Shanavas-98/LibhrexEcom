const express = require('express');
const router = express.Router();

const controller = require('../controllers/adminController');
const isLogin = require('../middleware/isLogin');

/* GET Methods. */
router.get('/',controller.homePage);
router.get('/login',controller.loginPage);
router.get('/profile',controller.profilePage);
router.get('/products',controller.productsPage);
router.get('/products/add',controller.addProductPage);
router.get('/products/edit',controller.editProductPage);
router.get('/categories',controller.categoriesPage);
router.get('/users',controller.usersPage);
router.get('/users/block/:id',controller.blockUser);
router.get('/users/unblock/:id',controller.unblockUser);
router.get('/users/details/:id',controller.viewUser);



// POST Methods
router.post('/signin',controller.doLogin)
router.post('/add-category',controller.addCategory)
router.post('/add-product',controller.addProduct)




module.exports = router;