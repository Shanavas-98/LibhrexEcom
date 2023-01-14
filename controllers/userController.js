
const bcrypt = require('bcrypt');
const db = require('../config/connection');
const session = require('express-session');
const mongoose = require('mongoose');

const sendOtp = require("../utils/nodemailer");

const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const CartModel = require("../models/cartModel");



const Category = CategoryModel.category;
const Subcategory = CategoryModel.subcategory;
const ObjectId = mongoose.Types.ObjectId;

let userErr = "";
let passErr = "";
let otp = "";

const signupPage = async (req, res, next) => {
    try {
        res.render('user/signup', { title: "SignUp", login: req.session })
    } catch (error) {
        next(error)
    }
}

const verifyPage = async (req, res, next) => {
    try {
        res.render('user/verifyotp', { title: "Verification", login: req.session })
    } catch (error) {
        next(error)
    }
}

const loginPage = async (req, res, next) => {
    try {
        if (!req.session.userLogin) {
            res.render('user/login', { title: "Login", login: req.session, userErr, passErr });
            userErr = ''
            passErr = ''
        } else {
            res.redirect('/');
        }
    } catch (error) {
        next(error)
    }
}

const homePage = async (req, res, next) => {
    try {
        const Products = await ProductModel.find().limit(12)
        return res.render('user/index', { title: "Home", login: req.session, Products });
    } catch (error) {
        next(error)
    }
}

const shopPage = async (req, res, next) => {
    try {
        console.log("<<shop page rendering>>");
        const Categories = await Category.find()
        const Subcategories = await Subcategory.find({$not:[{flag: true}]})
        const Products = await ProductModel.find()

        res.render('user/shop', { title: "Shop", login: req.session, Categories, Subcategories, Products })
    } catch (error) {
        next(error)
    }
}

const productPage = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await ProductModel.findById({_id: productId});
        const related = await ProductModel.find({
            $and:[
                {cat_id: product.cat_id},
                {_id:{$ne: productId}}
            ]
        }).limit(4)
        res.render('user/product', { title: "Product", login: req.session, product, related })
    } catch (error) {
        next(error)
    }
}

const ordersPage = async (req, res, next) => {
    try {
        res.render('user/orders', { title: "Orders", login: req.session })
    } catch (error) {
        next(error)
    }
}

const wishlistPage = async (req, res, next) => {
    try {
        res.render('user/wishlist', { title: "Wishlist", login: req.session })
    } catch (error) {
        next(error)
    }
}

const contactPage = async (req, res, next) => {
    try {
        res.render('user/contact', { title: "Contact", login: req.session })
    } catch (error) {
        next(error)
    }
}

const profilePage = async (req, res, next) => {
    console.log("<<profile page rendering>>");
    try {
        console.log(req.session.userId);
        const user = await UserModel.findOne({ _id: req.session.userId });
        res.render('user/user-profile', { title: "Profile", login: req.session, user })
    } catch (error) {
        next(error)
    }
}

const cartPage = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const user = await UserModel.findById({_id: userId});
        let Cart = await CartModel.findOne({userId: userId}).populate('cartItems.product').lean();
        
        if (Cart) {
            let Items = Cart.cartItems;
            res.render('user/cart', {title:"Cart",login: req.session,user,Items,index:1});
        } else {
            res.send("Your Cart is Empty");
        }
    } catch (error) {
        next(error)
    }
}

const checkoutPage = async (req, res, next) => {
    try {
        res.render('user/checkout', { title: "Checkout", login: req.session })
    } catch (error) {
        next(error)
    }
}

const getOtp = async (req, res, next) => {
    let email = req.session.email;
    otp = Math.floor(100000 + Math.random() * 900000);
    await sendOtp.sendVerifyEmail(email, otp)
        .then(() => {
            res.redirect('/verify');
        }).catch((error) => {
            next(error)
        })

}

const doSignup = async (req, res, next) => {
    try {
        req.session.email = req.body.email;
        const newUser = UserModel({
            fullname: req.body.fullname,
            email: req.body.email,
            mobile: req.body.mobile,
            password: await bcrypt.hash(req.body.password, 10),
            password2: req.body.password2
        })

        await newUser.save()
            .then(() => {
                next();
            })
            .catch((error) => {
                console.log(error);
                res.redirect("/register");
            })
    } catch (error) {
        next(error);
    }
}

const verifyUser = async (req, res, next) => {
    try {
        if (req.body.otp == otp) {
            await UserModel.findOneAndUpdate({ email: req.session.email }, { $set: { verified: true } })
                .then(() => {
                    otp = "";
                    res.redirect('/')
                })
                .catch((error)=>{
                    next(error)
                })

        } else {
            console.log("otp doesnt match");
            return res.redirect('/verify')
        }
    } catch (error) {
        next(error)
    }
}

const doLogin = async (req, res, next) => {
    console.log("<<<do login work>>>", req.body);
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            userErr = 'user doesnot exist';
            req.session.userLogin = false;
            return res.redirect('/login');
        }
        if (user.blocked) {
            userErr = 'sorry user blocked';
            req.session.userLogin = false;
            return res.redirect('/login');
        }
        const isPass = await bcrypt.compare(password, user.password);
        if (!isPass) {
            passErr = 'incorrect password';
            req.session.userLogin = false;
            return res.redirect('/login');
        }
        req.session.username = user.fullname
        req.session.userId = user._id
        req.session.userLogin = true
        res.redirect('/');

    } catch (error) {
        next(error)
    }
}

const doLogout = async (req, res, next) => {
    try {
        req.session.logOut = true
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        next(error)
    }
}

const addToCart = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const product = req.params.id
        const userCart = await CartModel.findOne({userId: userId});
        if(userCart){
            const isProduct = await CartModel.findOne({$and: [{userId: userId},{cartItems:{$elemMatch:{product}}}]})
            if (isProduct) {
                await CartModel.findOneAndUpdate({ $and: [{ userId }, { "cartItems.product": product }] }, { $inc: { "cartItems.$.quantity": 1 } });
                res.send({ success: true });
            } else {
                await CartModel.updateOne({ userId }, { $push: { cartItems: { product, quantity: 1 } } });
                res.send({ success: true });
            }
        } else {
            const cartDetails = new CartModel ({
                userId,
                cartItems: [{
                    product,
                    quantity:1
                }]
            })
            await cartDetails.save()
                .then(()=>{
                    res.send('success')
                })
                .catch((error)=>{
                    next(error)
                })
        }
    } catch (error) {
        next(error)
    }
}

const deleteItem = async(req,res,next)=>{
    try{
        const itemId = req.params.id
        await CartModel.findOneAndDelete({_id: itemId})
        res.redirect('/cart');
    }catch(error) {
        next(error)
    }
}


module.exports = {

    signupPage,
    verifyPage,
    loginPage,
    homePage,
    shopPage,
    productPage,
    ordersPage,
    wishlistPage,
    contactPage,
    profilePage,
    cartPage,
    checkoutPage,
    getOtp,
    verifyUser,
    doSignup,
    doLogin,
    doLogout,
    addToCart,
    deleteItem

}