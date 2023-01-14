const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

const AdminModel = require("../models/adminModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const BannerModel = require('../models/bannerModel')

const Category = CategoryModel.category;
const Subcategory = CategoryModel.subcategory;
const ObjectId = mongoose.Types.ObjectId;

let adminErr = false;
let passErr = false;

//const Brand = CategoryModel.brand;
const loginPage = async (req, res, next) => {
    console.log("<<login page rendering>>");
    try {
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
        res.render('admin/home', { title: "Dashboard" })
    } catch (error) {
        next(error)
    }
}

const profilePage = async (req, res, next) => {
    console.log("<<profile page rendering>>");
    try {
        const admin = await AdminModel.findOne({ _id: req.session.adminId });
        res.render('admin/admin-profile', { title: "Profile", admin })
    } catch (error) {
        next(error)
    }
}

const usersPage = async (req, res, next) => {
    console.log("<<users page rendering>>");
    try {
        const Users = await UserModel.find();
        let index = 1;
        res.render('admin/users-list', { title: "Users", index, Users })
    } catch (error) {
        next(error)
    }
}

const categoriesPage = async (req, res, next) => {
    console.log("<<categories page rendering>>");
    try {
        let index = 1;
        const Categories = await Category.find();
        const Subcategories = await Subcategory.find();
        res.render('admin/categories', { title: "Products :: Categories", index, Categories, Subcategories })
    } catch (error) {
        next(error)
    }
}

const productsPage = async (req, res, next) => {
    console.log("<<products page rendering>>");
    try {
        const Categories = await Category.find();
        const Subcategories = await Subcategory.find();
        const Products = await ProductModel.find();
        let index = 1;
        res.render('admin/products-list', { title: "Products", index, Categories, Subcategories, Products })
    } catch (error) {
        next(error)
    }
}

const addProductPage = async (req, res, next) => {
    console.log("<<add product page rendering>>");
    try {
        const Categories = await Category.find();
        const Subcategories = await Subcategory.find();
        res.render('admin/add-product', { title: "Products :: Add Product", Categories, Subcategories })
    } catch (error) {
        next(error)
    }
}

const editProductPage = async (req, res, next) => {
    console.log("<<edit product page rendering>>");
    try {
        const productId = ObjectId(req.params.id)
        console.log(productId);
        const Product = await ProductModel.findOne({ _id: productId });
        console.log(Product);
        const Categories = await Category.find();
        const Subcategories = await Subcategory.find();
        return res.render('admin/edit-product', { title: "Products :: Edit Product", Product, Categories, Subcategories })
    } catch (error) {
        next(error)
    }
}

const addBannerPage = async (req, res, next) => {
    console.log("<<add banner page rendering>>");
    try {
        const Banners = await BannerModel.find();
        res.render('admin/banners', { title: "Banners", Banners })
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
    const userId = req.params.id
    try {
        const user = await UserModel.findOne({ _id: userId })
        if (user.blocked) {
            await UserModel.findByIdAndUpdate({ _id: userId }, { $set: { blocked: false } })
        } else {
            await UserModel.findByIdAndUpdate({ _id: userId }, { $set: { blocked: true } })
        }
        return res.redirect('/admin/users')

    } catch (err) {
        next(err)
    }
}

const viewUser = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await UserModel.findOne({ _id: id })
        return res.render('admin/user-detail', { title: "user details", user })
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
const editCategory = async (req, res, next) => {
    const subcat_id = req.params.id;
    // const brandn = req.body.brand;
    try {
        const subcategory = await Subcategory.findOne({ _id: subcat_id });
        const category = await Category.findOne({ _id: subcategory.cat_id })
        // const isBrand = await Brand.findOne({ brand: brandn });

        return res.redirect('/admin/categories');

    } catch (error) {
        next(error);
    }
}

const flagCategory = async (req, res, next) => {
    const subcat_id = req.params.id;
    try {
        const subcategory = await Subcategory.findOne({ _id: subcat_id });
        if (subcategory.flag) {
            await Subcategory.findByIdAndUpdate({ _id: subcat_id }, { $set: { flag: false } })
        } else {
            await Subcategory.findByIdAndUpdate({ _id: subcat_id }, { $set: { flag: true } })
        }
        return res.redirect('/admin/categories');
    } catch (error) {
        next(error);
    }
}

const deleteCategory = async (req, res, next) => {
    const subcat_id = req.params.id;
    try {
        const subcategory = await Subcategory.deleteOne({ _id: subcat_id });
        return res.redirect('/admin/categories');

    } catch (error) {
        next(error);
    }
}

const flagProduct = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await ProductModel.findOne({ _id: productId });
        if (product.flag) {
            await ProductModel.findByIdAndUpdate({ _id: productId }, { $set: { flag: false } })
        } else {
            await ProductModel.findByIdAndUpdate({ _id: productId }, { $set: { flag: true, blockedDate: new Date } })
        }
        return res.redirect('/admin/products');
    } catch (error) {
        next(error);
    }
}

const addProduct = async (req, res, next) => {
    try {
        let categ = req.body.category.trim();
        let subcateg = req.body.subcategory.trim();
        let mrp = req.body.mrp;
        let srp = req.body.srp;
        let offer = Math.floor(Number((1-(srp/mrp))*100));
        const image = req.files;
        image.forEach(img => { });
        const productimages = image != null ? image.map((img) => img.filename) : null

        const newProduct = ProductModel({
            cat_id: ObjectId(categ),
            subcat_id: ObjectId(subcateg),
            productName: req.body.productName,
            description: req.body.description,
            mrp: req.body.mrp,
            srp: req.body.srp,
            discount: offer,
            qty: req.body.qty,
            image: productimages
        });

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

const editProduct = async (req, res, next) => {
    try {
        const productId = req.params.id

        let categ = req.body.category.trim();
        let subcateg = req.body.subcategory.trim();
        let mrp = req.body.mrp;
        let srp = req.body.srp;
        let offer = Math.floor(Number(((mrp-srp)/mrp)*100));
        const image = req.files;
        image.forEach(img => { });
        const productimages = image != null ? image.map((img) => img.filename) : null

        await ProductModel.findByIdAndUpdate({ _id: productId },
            {
                $set: {
                    cat_id: ObjectId(categ),
                    subcat_id: ObjectId(subcateg),
                    productName: req.body.productName,
                    description: req.body.description,
                    mrp: req.body.mrp,
                    srp: req.body.srp,
                    discount: offer,
                    qty: req.body.qty,
                    image: productimages
                }
            })
            .then(() => {
                res.redirect("/admin/products");
            }).catch((err) => {
                console.log(err.message);
                res.redirect("/admin/products");
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
    viewUser,
    addCategory,
    editCategory,
    flagCategory,
    deleteCategory,
    addProduct,
    flagProduct,
    editProduct

}