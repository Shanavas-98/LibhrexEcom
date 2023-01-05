
const bcrypt = require('bcrypt');
const db = require('../config/connection');
const session = require('express-session');

const isLogin = require("../middleware/isLogin");
const UserModel = require("../models/userModel");

module.exports = {

    signupPage: async(req,res,next)=>{
        try{
            console.log("<<signup page rendering>>");
            res.render('user/signup')
        }catch(error){
            next(error)
        }
    },

    loginPage: async(req,res,next)=>{
        console.log("<<login page rendering>>");
        console.log(req.session);
        try{

            if(!req.session.userLogin){
                res.render('user/login');
            }else{
                res.redirect('/');
            }

        }catch(error){
            next(error)
        }
    },

    homePage: async(req,res,next)=>{
        console.log("<<rendering home page>>");
        try{
            res.render('user/index');
        }catch(error){
            next(error)
        }
    },

    shopPage: async(req,res,next)=>{
        try{
            res.render('user/shop')
        }catch(error){
            next(error)
        }
    },

    productPage: async(req,res,next)=>{
        try{
            res.render('user/product')
        }catch(error){
            next(error)
        }
    },

    ordersPage: async(req,res,next)=>{
        try{
            res.render('user/orders')
        }catch(error){
            next(error)
        }
    },

    wishlistPage: async(req,res,next)=>{
        try{
            res.render('user/wishlist')
        }catch(error){
            next(error)
        }
    },

    contactPage: async(req,res,next)=>{
        try{
            res.render('user/contact')
        }catch(error){
            next(error)
        }
    },

    profilePage: async(req,res,next)=>{
        try{
            res.render('user/profile')
        }catch(error){
            next(error)
        }
    },

    cartPage: async(req,res,next)=>{
        try{
            res.render('user/cart')
        }catch(error){
            next(error)
        }
    },

    checkoutPage: async(req,res,next)=>{
        try{
            res.render('user/checkout')
        }catch(error){
            next(error)
        }
    },

    doSignup: async(req,res,next)=>{
        try{
            const newUser = UserModel({
                fullname:req.body.fullname,
                email:req.body.email,
                mobile:req.body.mobile,
                password:await bcrypt.hash(req.body.password,10),
                password2:req.body.password2
        
            })

            newUser.save()
                .then(()=>{
                res.redirect("/login");
            })
                .catch((error)=>{
                    console.log(error);
                    res.redirect("/register");
                })
        }catch(error){
            next(error);
        }
    },

    doLogin: async(req,res,next)=>{
        console.log("<<<do login work>>>",req.body);
    try{
        const {email, password} = req.body;
        const user = await UserModel.findOne({$and: [{email: email},{blocked:false}]});
        if(!user){
            userErr = true;
            res.redirect('/login');
            return 
        }
        const isPass = await bcrypt.compare(password, user.password);
        if(!isPass){
            passErr = true;
            res.redirect('/login');
            return
        }
        req.session.user = user.fullname
        req.session.userId = user._id
        req.session.userLogin = true
        res.redirect('/')

    }catch(error){
        next(error)
    }
    },

    doLogout: async(req,res,next)=>{
        try{
            req.session.logOut = true
            req.session.destroy()
            res.redirect('/')
        }catch(error){
            next(error)
        }
    },

}