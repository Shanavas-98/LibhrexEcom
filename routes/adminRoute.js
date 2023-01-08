const express = require('express');
const router = express.Router();

const controller = require('../controllers/adminController');
const isLogin = require('../middleware/isLogin');

/* GET Methods. */
router.get('/',isLogin.adminLogin,controller.homePage);
router.get('/login',controller.loginPage);
router.get('/products',controller.productsPage);
router.get('/products/add',controller.addProductPage);
router.get('/products/edit',controller.editProductPage);
router.get('/categories',controller.categoriesPage);






// POST Methods
router.post('/signin',controller.doLogin)
router.post('/addcategory',controller.addCategory)



module.exports = router;