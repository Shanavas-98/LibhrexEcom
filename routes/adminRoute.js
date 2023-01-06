const express = require('express');
const router = express.Router();

const controller = require('../controllers/adminController');
const isLogin = require('../middleware/isLogin');
/* GET home page. */
router.get('/',isLogin.adminLogin,controller.homePage);
router.get('/login',controller.loginPage);


module.exports = router;