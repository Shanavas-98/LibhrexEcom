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
router.get('/products/edit/:id',controller.editProductPage);

router.get('/products/flag/:id',controller.flagProduct);
router.get('/products/details/:id',controller.editProductPage);
router.get('/categories',controller.categoriesPage);

router.get('/users',controller.usersPage);
router.get('/users/block/:id',controller.blockUser);
router.get('/users/details/:id',controller.viewUser);
router.get('/categories/edit/:id',controller.editCategory);
router.get('/categories/flag/:id',controller.flagCategory);
router.get('/categories/delete/:id',controller.deleteCategory);



// POST Methods
router.post('/signin',controller.doLogin)
router.post('/categories/add',controller.addCategory)
router.post('/products/add-product',controller.addProduct);
router.post('/products/edit-product/:id',controller.editProduct);


module.exports = router;