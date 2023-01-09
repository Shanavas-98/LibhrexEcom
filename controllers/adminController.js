const bcrypt = require('bcrypt');
const { render } = require('ejs');
const db = require("../config/connection");
const mongoose = require('mongoose')

const AdminModel = require("../models/adminModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const Category = CategoryModel.category;
const Subcategory = CategoryModel.subcategory;
const ObjectId = mongoose.Types.ObjectId;

let adminErr = false;
let passErr = false;

//const Brand = CategoryModel.brand;
const loginPage =  async (req, res, next) => {
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
}

const homePage = async (req, res, next) => {
    console.log("<<homepage rendering>>");
    try {
        res.render('admin/home',{title:"Dashboard"})
    } catch (error) {
        next(error)
    }
}

const profilePage = async (req, res, next) => {
    console.log("<<profile page rendering>>");
    try {
        console.log(req.session.adminId);
        const admin = await AdminModel.findOne({ _id: req.session.adminId});
        res.render('admin/admin-profile',{title:"Profile",admin})
    } catch (error) {
        next(error)
    }
}

const usersPage = async (req, res, next) => {
    console.log("<<users page rendering>>");
    try {
        const users = await UserModel.find();
        let index = 1;
        res.render('admin/users-list',{title:"Users",index,users})
    } catch (error) {
        next(error)
    }
}

const productsPage = async (req, res, next) => {
    console.log("<<products page rendering>>");
    try {
        res.render('admin/products-list',{title:"Products"})
    } catch (error) {
        next(error)
    }
}

const addProductPage = async (req, res, next) => {
    console.log("<<add product page rendering>>");
    try {
        const Categories = await Category.find()
        const Subcategories = await Subcategory.find()
        res.render('admin/add-product',{title:"Products :: Add Product",Categories,Subcategories})
    } catch (error) {
        next(error)
    }
}

const editProductPage = async (req, res, next) => {
    console.log("<<edit product page rendering>>");
    try {
        res.render('admin/edit-product',{title:"Products :: Edit Product"})
    } catch (error) {
        next(error)
    }
}

const categoriesPage = async (req, res, next) => {
    console.log("<<categories page rendering>>");
    try {
        let index=1;
        const Categories = await Category.find()
        const Subcategories = await Subcategory.find()
        console.log("<<categories>>");
        console.log(Categories);
        console.log("<<subcategories>>");
        console.log(Subcategories);
        res.render('admin/categories',{title:"Products :: Categories",index,Categories,Subcategories})
    } catch (error) {
        next(error)
    }
}

const doLogin = async (req, res, next) => {
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
}

const blockUser = async (req, res, next) => {
    try {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({ _id: id }, { $set: { blocked: true } })
            .then(() => {
                res.redirect('/admin/users')
            })

    } catch (err) {
        next(err)
    }
}

const unblockUser = async (req, res, next) => {
    try {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({ _id: id }, { $set: { blocked: false } })
            .then(() => {
                res.redirect('/admin/users')
            })

    } catch (error) {
        next(error)
    }
}

const viewUser = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await UserModel.findOne({ _id: id })
        return res.render('admin/user-detail',{title:"user details",user})
    } catch (error) {
        next(error)
    }
}

const addCategory = async (req, res, next) => {
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

        return res.redirect('/admin/categories');

    } catch (error) {
        next(error);
    }
}

const addProduct = async (req, res, next)=>{
    try {
        const { product, description, mrp, srp, categ, subcateg} = req.body;

        const image = req.files;
        image.forEach(img => { });
        const productimages = image != null ? image.map((img) => img.filename) : null

        const newProduct = ProductModel({
            category:ObjectId(categ),
            subcategory:ObjectId(subcateg),
            product, 
            description, 
            mrp, 
            srp,
            // image: image.filename,
            image: productimages
        });
        console.log(newProduct)

        await newProduct
            .save()
            .then(() => {
                res.redirect("/admin/products");
            }).catch((err) => {
                console.log(err.message);
                res.redirect("/admin/products/add");
            });

    } catch (err) {
        next(err)
    }
}

module.exports = {

    loginPage,
    homePage,
    profilePage,
    usersPage,
    productsPage,
    addProductPage,
    editProductPage,
    categoriesPage,
    doLogin,
    blockUser,
    unblockUser,
    viewUser,
    addCategory,
    addProduct

}