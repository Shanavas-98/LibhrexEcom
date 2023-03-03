const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

const AdminModel = require("../models/adminModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const BannerModel = require('../models/bannerModel');
const OrderModel = require('../models/orderModel');
const CouponModel = require('../models/couponModel');
const pdfTable = require('../utils/pdfTable')

const Category = CategoryModel.category;
const Subcategory = CategoryModel.subcategory;
const ObjectId = mongoose.Types.ObjectId;

//const Brand = CategoryModel.brand;
const loginPage = async (req, res, next) => {
    try {
        if (!req.session.adminLogin) {
            res.render('admin/account-login', { title: "Admin Login", login: req.session });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error)
    }
}




const dashBoard = async (req, res) => {
    try {
        const usersCount = await UserModel.countDocuments({ blocked: false });
        const ordersCount = await OrderModel.countDocuments({});
        const placedCount = await OrderModel.countDocuments({ "deliveryStatus.placed.state": true });
        const shippedCount = await OrderModel.countDocuments({ "deliveryStatus.shipped.state": true });
        const deliveredCount = await OrderModel.countDocuments({ "deliveryStatus.delivered.state": true });
        const cancelledCount = await OrderModel.countDocuments({ "deliveryStatus.cancelled.state": true });
        const productsCount = await ProductModel.countDocuments({ flag: false });

        const revenueArr = await OrderModel.aggregate([
            {
                $match:
                {
                    $and: [
                        { "payment.status": "success" },
                        { "deliveryStatus.delivered.state": true }
                    ]
                }
            },
            {
                $group: {
                    _id: 0,
                    total: { $sum: "$subtotal" }
                }
            }
        ])

        const revenue = revenueArr[0].total;

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const salesReport = await OrderModel.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$orderDate" },
                        year: { $year: "$orderDate" }
                    },
                    sales: { $sum: "$grandtotal" }
                }
            },
            {
                $project: {
                    month: "$_id.month",
                    year: "$_id.year",
                    sales: 1,
                    _id: 0
                }
            }, {
                $sort: { month: 1, year: 1 }
            }
        ])

        const labels = salesReport.map(d => monthNames[d.month - 1] + "-" + d.year);
        const graphData = salesReport.map(d => d.sales);
        const counts = {
            usersCount,
            ordersCount,
            revenue,
            productsCount
        }
        const pieData = {
            placedCount,
            shippedCount,
            deliveredCount,
            cancelledCount
        }

        const sales = salesReport.map(item => {
            return {
                date: monthNames[item.month - 1] + "-" + item.year,
                sales: item.sales
            }
        })
        // const pieData = JSON.stringify(pieChart);
        // const salesData = JSON.stringify(sales);
        // const lineGraph = JSON.stringify(data);
        // const lineLabel = JSON.stringify(labels);
        res.render("admin/home", { title: "Dash Board", counts, pieData, sales, graphData, labels })
    } catch (error) {
        throw new Error(error)
    }

}


const sales = async (fromDate, toDate) => {
    try {
        const sales_report = await OrderModel.aggregate([
            {
                $match: {
                    "deliveryStatus.delivered.state": true,
                    "orderDate": { $gte: fromDate, $lt: toDate }
                }
            },
            {
                $unwind: "$orderItems"
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$orderDate" },
                        year: { $year: "$orderDate" }
                    },
                    sales: { $sum: "$orderItems.total" },
                    products: { $sum: "$orderItems.qty" },
                    orders: { $addToSet: "$_id" }
                }
            },
            {
                $project: { month: "$_id.month", year: "$_id.year", sales: 1, products: 1, orders: 1, _id: 0 }
            }, {
                $sort: { month: 1, year: 1 }
            }
        ])


        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const salesReport = sales_report.map(item => {
            return {
                month: monthNames[item.month - 1],
                totalAmount: item.sales,
                totalOrders: item.orders.length,
                productsSold: item.products
            }
        })

        return salesReport;
    } catch (error) {
        throw new Error(error)
    }
}

const salesReport = async (req, res, next) => {
    try {
        const currentYear = new Date().getFullYear();
        const fromDate = new Date(currentYear, 0, 1)
        const toDate = new Date(currentYear + 1, 0, 1)
        const salesReport = await sales(fromDate, toDate)
        if (salesReport) {
            const pdf = pdfTable.generateReport(salesReport)
            pdf.pipe(res);
            pdf.end();
        }
    } catch (error) {
        next(error)
    }
}


const homePage = async (req, res, next) => {
    try {
        const productsCnt = await ProductModel.countDocuments().exec()
        console.log("products", productsCnt);
        const ordersCnt = await OrderModel.countDocuments().exec()
        console.log("orders", ordersCnt);
        await OrderModel.aggregate([
            {
                $match:
                {
                    $and: [
                        { "payment.status": "success" },
                        { "deliveryStatus.delivered.state": true }
                    ]
                }
            },
            {
                $group: {
                    _id: new Date(),
                    total: { $sum: "$grandtotal" }
                }
            }
        ]).then((revenue) => {
            let total = 0;
            if (revenue.length > 0) {
                total = revenue[0].total
            }
            return res.render('admin/home', { title: "Dashboard", productsCnt, ordersCnt, total })
        })
    } catch (error) {
        next(error)
    }
}

const profilePage = async (req, res, next) => {
    try {
        const admin = await AdminModel.findOne({ _id: req.session.adminId });
        res.render('admin/admin-profile', { title: "Profile", admin })
    } catch (error) {
        next(error)
    }
}

const usersPage = async (req, res, next) => {
    try {
        const before = res.pagination.previous;
        const current = res.pagination.current;
        const after = res.pagination.next;
        const Users = await UserModel.find()
            .skip(current.start)
            .limit(current.limit)
            .exec()
        let index = 1;
        res.render('admin/users-list', { title: "Users", index, Users, before, current, after })
    } catch (error) {
        next(error)
    }
}

const categoriesPage = async (req, res, next) => {
    try {
        let index = 1;
        const before = res.pagination.previous;
        const current = res.pagination.current;
        const after = res.pagination.next;
        const Categories = await Category.find()
            .sort({ category: 1 })
            .skip(current.start)
            .limit(current.limit)
        console.log(Categories);
        const Subcategories = await Subcategory.find()
        res.render('admin/categories', { title: "Products :: Categories", index, Categories, Subcategories, before, current, after })
    } catch (error) {
        next(error)
    }
}

const productsPage = async (req, res, next) => {
    try {
        const Categories = await Category.find();
        const Subcategories = await Subcategory.find();
        const before = res.pagination.previous;
        const current = res.pagination.current;
        const after = res.pagination.next;
        const Products = await ProductModel.find()
            .sort({ productName: 1 })
            .skip(current.start)
            .limit(current.limit)
            .exec()
        //const Products = res.pagination.current;
        let index = 1;
        res.render('admin/products-list', { title: "Products", index, Categories, Subcategories, Products, before, current, after })
    } catch (error) {
        next(error)
    }
}

const addProductPage = async (req, res, next) => {
    try {
        const Categories = await Category.find();
        const Subcategories = await Subcategory.find();
        res.render('admin/add-product', { title: "Products :: Add Product", Categories, Subcategories })
    } catch (error) {
        next(error)
    }
}

const editProductPage = async (req, res, next) => {
    try {
        const productId = ObjectId(req.params.id);
        const Product = await ProductModel.findOne({ _id: productId });
        const Categories = await Category.find();
        const Subcategories = await Subcategory.find();
        return res.render('admin/edit-product', { title: "Products :: Edit Product", Product, Categories, Subcategories })
    } catch (error) {
        next(error)
    }
}

const addBannerPage = async (req, res, next) => {
    try {
        const Banners = await BannerModel.find();
        res.render('admin/banners', { title: "Banners", Banners })
    } catch (error) {
        next(error)
    }
}

const ordersPage = async (req, res, next) => {
    try {
        let index = 1000
        const before = res.pagination.previous;
        const current = res.pagination.current;
        const after = res.pagination.next;
        const Orders = await OrderModel.find()
            .sort({ orderDate: -1 })
            .skip(current.start)
            .limit(current.limit)
            .populate('user')
            .exec()
        res.render('admin/orders-list', { title: "Orders", Orders, index, before, current, after })
    } catch (error) {
        next(error)
    }
}

const orderDetails = async (req, res, next) => {
    try {
        const order = await OrderModel.findOne({ _id: req.params.id })
            .populate(['user', 'orderItems.product'])
            .lean()
        res.render('admin/order-details', { title: "Order-Details", order })
    } catch (error) {
        next(error)
    }
}

const couponsPage = async (req, res, next) => {
    try {
        let index = 1;
        const before = res.pagination.previous;
        const current = res.pagination.current;
        const after = res.pagination.next;
        await CouponModel.find()
            .sort({ validity: -1 })
            .skip(current.start)
            .limit(current.limit)
            .exec()
            .then((coupons) => {
                res.render('admin/coupons-list', { title: "Coupons", index, coupons, before, current, after })
            })
    } catch (error) {
        next(error)
    }
}

const addCouponPage = async (req, res, next) => {
    try {
        res.render('admin/add-coupon', { title: "Add Coupon" })
    } catch {
        next(error)
    }
}

const editCouponPage = async (req, res, next) => {
    try {
        await CouponModel.findOne({ _id: req.params.cpnId })
            .then((coupon) => {
                res.render('admin/edit-coupon', { title: "Edit Coupon", coupon })
            })
    } catch (error) {
        next(error)
    }
}

const doLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email: email.trim() });
        if (!admin) {
            req.session.adminLogin = false;
            req.session.adminErr = "Admin don't exist";
            return res.redirect('/admin/login');
        }
        req.session.adminErr = "";
        const isPass = await bcrypt.compare(password, admin.password);
        if (!isPass) {
            req.session.adminLogin = false;
            req.session.passErr = "Wrong password";
            return res.redirect('/admin/login');
        }
        req.session.passErr = "";
        req.session.adminname = admin.branch;
        req.session.adminId = admin._id;
        req.session.adminLogin = true;
        res.redirect('/admin');

    } catch (error) {
        next(error)
    }
}

const doLogout = async (req, res, next) => {
    try {
        req.session.adminLogin = false
        req.session.destroy()
        res.redirect('/admin/login')
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
        const user = await UserModel.findOne({ _id: req.params.id })
        return res.render('admin/user-detail', { title: "user details", user })
    } catch (error) {
        next(error)
    }
}

const addCategory = async (req, res, next) => {
    try {
        const cat = req.body.category;
        console.log("category", cat);
        await new Category({
            category: cat
        }).save()
            .then(() => {
                res.json({ success: true })
            }).catch(() => {
                res.json({ err: "category already exist!" })
            })
    } catch (error) {
        next(error)
    }
}

const addSubcategory = async (req, res, next) => {
    try {
        const cat = req.body.category;
        const subcat = req.body.subcategory;
        await new Subcategory({
            catId: cat,
            subcategory: subcat
        }).save()
            .then(() => {
                res.redirect('/admin/categories')
            }).catch(() => {
                res.json({ err: "subcategory already exist!" })
            })
    } catch (error) {
        next(error);
    }
}

const editCategory = async (req, res, next) => {
    const subcatId = req.params.id;
    // const brandn = req.body.brand;
    try {
        const subcategory = await Subcategory.findOne({ _id: subcatId });
        const category = await Category.findOne({ _id: subcategory.catId })
        // const isBrand = await Brand.findOne({ brand: brandn });

        return res.redirect('/admin/categories');

    } catch (error) {
        next(error);
    }
}

const flagCategory = async (req, res, next) => {
    const subcatId = req.params.id;
    try {
        const subcategory = await Subcategory.findOne({ _id: subcatId });
        if (subcategory.flag) {
            await Subcategory.findByIdAndUpdate({ _id: subcatId }, { $set: { flag: false } })
        } else {
            await Subcategory.findByIdAndUpdate({ _id: subcatId }, { $set: { flag: true } })
        }
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
        let offer = Math.floor(Number((1 - (srp / mrp)) * 100));
        const image = req.files;
        image.forEach(img => { });
        const productimages = image != null ? image.map((img) => img.filename) : null

        const newProduct = ProductModel({
            catId: ObjectId(categ),
            subcatId: ObjectId(subcateg),
            productName: req.body.product,
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
                res.redirect("/admin/product-add");
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
        let offer = Math.floor(Number(((mrp - srp) / mrp) * 100));
        const image = req.files;
        image.forEach(img => { });
        const productimages = image != null ? image.map((img) => img.filename) : null

        await ProductModel.findByIdAndUpdate(
            { _id: productId },
            {
                $set: {
                    catId: ObjectId(categ),
                    subcatId: ObjectId(subcateg),
                    productName: req.body.product,
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

const orderShip = async (req, res, next) => {
    const orderId = req.params.id;
    try {
        await OrderModel.findOneAndUpdate(
            { _id: orderId },
            { $set: { 'deliveryStatus.shipped.state': true, 'deliveryStatus.shipped.date': new Date } }
        ).then(() => {
            res.redirect('/admin/orders');
        })
    } catch (error) {
        next(error);
    }
}

const orderDelivery = async (req, res, next) => {
    const orderId = req.params.id;
    try {
        await OrderModel.findOneAndUpdate(
            { _id: orderId },
            { $set: { 'deliveryStatus.delivery.state': true, 'deliveryStatus.delivery.date': new Date } }
        ).then(() => {
            res.redirect('/admin/orders');
        })
    } catch (error) {
        next(error);
    }
}

const orderDelivered = async (req, res, next) => {
    const orderId = req.params.id;
    try {
        await OrderModel.findOneAndUpdate(
            { _id: orderId },
            { $set: { 'payment.status':'success','deliveryStatus.delivered.state': true, 'deliveryStatus.delivered.date': new Date } }
        ).then(() => {
            res.redirect('/admin/orders');
        })
    } catch (error) {
        next(error);
    }
}

const orderCancel = async (req, res, next) => {
    const orderId = req.params.id;
    try {
        await OrderModel.findOneAndUpdate(
            { _id: orderId },
            { $set: { 'deliveryStatus.cancelled.state': true, 'deliveryStatus.cancelled.date': new Date } }
        ).then(() => {
            res.redirect('/admin/orders');
        })
    } catch (error) {
        next(error);
    }
}

const addCoupon = async (req, res, next) => {
    try {
        let cpn_code = req.body.code.toUpperCase().trim()
        const coupon = await CouponModel.findOne({ code: cpn_code })
        if (!coupon) {
            new CouponModel({
                code: cpn_code,
                discount: req.body.discount,
                minBill: req.body.minBill,
                maxDiscount: req.body.maxDiscount,
                validity: req.body.validity
            }).save()
                .then(() => {
                    res.redirect("/admin/coupons")
                })
        } else {
            throw ("coupon already exist")
        }
    } catch (error) {
        next(error);
    }
}

const editCoupon = async (req, res, next) => {
    try {
        let cpn_code = req.body.code.toUpperCase().trim()
        await CouponModel.findByIdAndUpdate(
            { _id: req.params.cpnId },
            {
                $set: {
                    code: cpn_code,
                    discount: req.body.discount,
                    minBill: req.body.minBill,
                    maxDiscount: req.body.maxDiscount,
                    validity: req.body.validity
                }
            }).then(() => {
                res.redirect("/admin/coupons")
            }).catch((err) => {
                console.log(err.message);
                res.redirect("/admin/coupons")
            })
    } catch (error) {
        next(error);
    }
}

const blockCoupon = async (req, res, next) => {
    try {
        const couponId = req.params.cpnId
        const coupon = await CouponModel.findOne({ _id: couponId });
        if (coupon.block) {
            await CouponModel.findByIdAndUpdate({ _id: couponId }, { $set: { block: false } })
        } else {
            await CouponModel.findByIdAndUpdate({ _id: couponId }, { $set: { block: true } })
        }
        return res.redirect("/admin/coupons")
    } catch {
        next(error)
    }
}





module.exports = {
    loginPage,
    dashBoard,
    homePage,
    addBannerPage,
    profilePage,
    usersPage,
    productsPage,
    addProductPage,
    editProductPage,
    categoriesPage,
    ordersPage,
    orderDetails,
    couponsPage,
    addCouponPage,
    editCouponPage,
    doLogin,
    doLogout,
    blockUser,
    viewUser,
    addCategory,
    addSubcategory,
    editCategory,
    flagCategory,
    addProduct,
    flagProduct,
    editProduct,
    orderShip,
    orderDelivery,
    orderDelivered,
    orderCancel,
    addCoupon,
    editCoupon,
    blockCoupon,
    salesReport
}