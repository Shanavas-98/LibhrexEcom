
const bcrypt = require('bcrypt');
const { render } = require('ejs');
const db = require("../config/connection");

const AdminModel = require("../models/adminModel");
const CategoryModel = require("../models/categoryModel");
const Category = CategoryModel.category;
const Subcategory = CategoryModel.subcategory;
//const Brand = CategoryModel.brand;



let adminErr = false;
let passErr = false;


module.exports = {

    loginPage: async (req, res, next) => {
        console.log("<<login page rendering>>");
        try {
            console.log(req.session);
            if (!req.session.adminLogin) {
                res.render('admin/account-login', { title: "Admin Login", login: req.session, adminErr, passErr });
                adminErr = false
                passErr = false
            } else {
                res.redirect('/admin');
            }
        } catch (error) {
            next(error)
        }
    },

    homePage: async (req, res, next) => {
        console.log("<<homepage rendering>>");
        try {
            res.render('admin/home')
        } catch (error) {
            next(error)
        }
    },

    productsPage: async (req, res, next) => {
        console.log("<<products page rendering>>");
        try {
            res.render('admin/products-list')
        } catch (error) {
            next(error)
        }
    },

    addProductPage: async (req, res, next) => {
        console.log("<<add product page rendering>>");
        try {
            res.render('admin/add-product')
        } catch (error) {
            next(error)
        }
    },

    editProductPage: async (req, res, next) => {
        console.log("<<edit product page rendering>>");
        try {
            res.render('admin/edit-product')
        } catch (error) {
            next(error)
        }
    },

    categoriesPage: async (req, res, next) => {
        console.log("<<categories page rendering>>");
        try {
            let index=1;
            const Categories = await Category.find()
            const Subcategories = await Subcategory.find()
            console.log(Categories,Subcategories);
            res.render('admin/categories',{index,Categories,Subcategories})
        } catch (error) {
            next(error)
        }
    },

    doLogin: async (req, res, next) => {
        console.log("<<<do login work>>>", req.body);
        try {
            const { email, password } = req.body;
            const admin = await AdminModel.findOne({ email: email });
            if (!admin) {
                adminErr = true;
                req.session.adminLogin = false;
                return res.redirect('/admin/login');
            }
            const isPass = await bcrypt.compare(password, admin.password);
            if (!isPass) {
                passErr = true;
                req.session.adminLogin = false;
                return res.redirect('/admin/login');
            }
            req.session.adminname = admin.branch;
            req.session.adminId = admin._id;
            req.session.adminLogin = true;
            res.redirect('/admin');

        } catch (error) {
            next(error)
        }
    },

    addCategory: async (req, res, next) => {
        console.log(req.body);
        const cat = req.body.category;
        const subcat = req.body.subcategory;
        // const brandn = req.body.brand;

        const isCat = await Category.findOne({ category: cat });
        const isSubcat = await Subcategory.findOne({ subcategory: subcat });
        // const isBrand = await Brand.findOne({ brand: brandn });

        try {
            if (!isCat) {
                const newCat = Category({
                    category: cat
                })
                await newCat.save();
            }
            if (!isSubcat) {
                const Cat = await Category.findOne({ category: cat });
                const newSubcat = Subcategory({
                    cat_id: Cat._id,
                    subcategory: subcat
                })
                await newSubcat.save();
            }
            // if (!isBrand) {
            //     const Cat = await Category.findOne({ category: cat });
            //     const Subcat = await Subcategory.findOne({ subcategory: subcat });
            //     const newBrand = Brand({
            //         cat_id: Cat._id,
            //         subcat_id: Subcat._id,
            //         brand: brandn
            //     })
            //     await newBrand.save();
            // }

            return res.redirect('/admin/categories');

        } catch (error) {
            next(error);
        }
    }



}