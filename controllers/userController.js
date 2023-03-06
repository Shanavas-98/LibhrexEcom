require('../config/connection');
require('dotenv').config()
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const emailOtp = require("../utils/nodemailer");
const stripe = require('stripe')(process.env.SECRET_KEY);

const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const CartModel = require("../models/cartModel");
const WishlistModel = require("../models/wishlistModel");
const OrderModel = require("../models/orderModel");
const CouponModel = require('../models/couponModel');
const OtpModel = require('../models/otpModel');

const Category = CategoryModel.category;
const Subcategory = CategoryModel.subcategory;
const ObjectId = mongoose.Types.ObjectId;

const DOMAIN=process.env.DOMAIN;

let count = { cart: 0, wish: 0 }

const signupPage = async (req, res, next) => {
    try {
        res.render('user/signup', { title: "SignUp", login: req.session })
    } catch (error) {
        next(error)
    }
}

const forgotPage = async (req, res, next) => {
    try {
        res.render('user/forgot', { title: "Reset Password", login: req.session })
    } catch (error) {
        next(error)
    }
}

const loginPage = async (req, res, next) => {
    try {
        if (!req.session.userLogin) {
            res.render('user/login', { title: "Login", login: req.session });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        next(error)
    }
}

const homePage = async (req, res, next) => {
    try {
        const Products = await ProductModel.find()
        return res.render('user/index', { title: "Home", login: req.session, Products, count});
    } catch (error) {
        next(error)
    }
}

const shopPage = async (req, res, next) => {
    try {
        const Categories = await Category.find()
        const before = res.pagination.previous;
        const current = res.pagination.current;
        const after = res.pagination.next;
        const Products = await ProductModel.find({ flag: { $ne: true } })
            .skip(current.start)
            .limit(current.limit)
            .exec()
        
        //const Products = res.pagination.current;
        res.render('user/shop', { title: "Shop", login: req.session, Categories, Products, count, before, current, after })
    } catch (error) {
        next(error)
    }
}

const productPage = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await ProductModel.findById({ _id: productId });
        const related = await ProductModel.find({
            $and: [
                { catId: product.catId },
                { _id: { $ne: productId } }
            ]
        }).limit(4)
        res.render('user/product', { title: "Product", login: req.session, product, related, count })
    } catch (error) {
        next(error)
    }
}

const profilePage = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ _id: req.session.userId });
        res.render('user/profile', { title: "Profile", login: req.session, user, count })
    } catch (error) {
        next(error)
    }
}

const resetPage = async(req,res,next)=>{
    try{
        const user = await UserModel.findOne({ _id: req.session.userId });
        res.render('user/reset-password',{title:"Change Password",login:req.session, user, count})
    }catch(error){
        next(error)
    }
}

const wishlistPage = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        let Wishlist = await WishlistModel.findOne({ userId: userId }).populate('wishItems.product').lean();

        if (Wishlist) {
            let Items = Wishlist.wishItems;
            res.render('user/wishlist', { title: "Wishlist", login: req.session, Items, index: 1, count });
        } else {
            res.render('user/wishlist', { title: "Wishlist", login: req.session, Items: 0, index: 1, count });
        }
    } catch (error) {
        next(error)
    }
}

const cartPage = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const user = await UserModel.findById({ _id: userId });
        const Cart = await CartModel.findOne({ userId: userId })
            .populate('cartItems.product')
            .lean();
        if (Cart) {
            let subtotal = Cart.cartItems.map(item => item.price).reduce((acc, val) => acc + val, 0);
            const Items = Cart.cartItems;
            res.render('user/cart', { title: "Cart", login: req.session, user, Items, index: 1, count, subtotal });
        } else {
            res.render('user/cart', { title: "Cart", login: req.session, user, Items: 0, index: 1, count });
        }
    } catch (error) {
        next(error)
    }
}

const checkoutPage = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ _id: req.session.userId })
        const Cart = await CartModel.findOne({ userId: req.session.userId })
            .populate('cartItems.product')
            .lean();
        let subtotal = Cart.cartItems.map(item => item.price).reduce((acc, val) => acc + val, 0);
        subtotal = subtotal.toFixed(2)
        const addresses = user.addresses
        if (addresses && subtotal) {
            res.render('user/checkout', { title: "Checkout", login: req.session, count, addresses, subtotal })
        }

    } catch (error) {
        next(error)
    }
}

const addressPage = async (req, res, next) => {
    try {
        res.render('user/address', { title: "Address", login: req.session, count })
    } catch (error) {
        next(error)
    }
}

const editaddressPage = async (req, res, next) => {
    try {
        const addrId = req.params.id
        const user = await UserModel.findOne(
            {
                $and: [
                    { _id: req.session.userId },
                    { "addresses._id": addrId }
                ]
            },
            { addresses: 1 });
        const address = user.addresses
        if (address) {
            res.render('user/edit-address', { title: "Address :: Edit", login: req.session, count, address, addrId })
        }
    } catch (error) {
        next(error)
    }
}

const orderSuccess = async (req, res, next) => {
    try {
        res.render('user/order-success', { title: "Checkout", login: req.session, count })
    } catch (error) {
        next(error)
    }
}

const ordersPage = async (req, res, next) => {
    try {
        const before = res.pagination.previous;
        const current = res.pagination.current;
        const after = res.pagination.next;
        const orders = await OrderModel.find({ user: req.session.userId })
            .sort({ orderDate: -1 })
            .skip(current.start)
            .limit(current.limit)
            .populate('orderItems.product')
            .exec()
            
        res.render('user/orders', { title: "Orders", login: req.session, count, orders,before,current,after })
    } catch (error) {
        next(error)
    }
}

const orderDetails = async (req, res, next) => {
    try {
        const order = await OrderModel.findOne({
            $and: [
                { _id: req.params.id },
                { user: req.session.userId }
            ]
        }).populate('orderItems.product')
            .lean()
        res.render('user/orderdetails', { title: "Orders", login: req.session, count, order })
    } catch (error) {
        next(error)
    }
}

const paymentPage = async (req, res, next) => {
    try {
        res.render('user/payment')
    } catch (error) {
        next(error)
    }
}

const couponsPage = async (req, res, next) => {
    try {
        const before = res.pagination.previous;
        const current = res.pagination.current;
        const after = res.pagination.next;
        await CouponModel.find()
            .skip(current.start)
            .limit(current.limit)
            .then((coupons) => {
                res.render('user/coupons', { title: "Coupons", login: req.session, count, coupons,before,current,after })
            })
    } catch (error) {
        next(error)
    }
}

const doSignup = async (req, res, next) => {
    try {
        let otpString = req.body.otp.trim()
        //const isOtp = await bcrypt.compare(otpString, req.session.otp);
        const otpData = await OtpModel.findOne({ email: req.body.email.trim() });

        const isOtp = await bcrypt.compare(otpString, otpData.otp);
        if (!isOtp) {
            return res.json({ err: "incorrect otp" })
        }
        if (new Date() > otpData.expiry) {
            return res.json({ err: "otp expired" })
        }

        await new UserModel({
            fullname: req.body.fullname,
            mobile: req.body.mobile,
            email: req.body.email.trim(),
            password: await bcrypt.hash(req.body.password, 10),
            verified: true
        }).save()
            .then(async (user) => {
                //delete otp after signup
                await OtpModel.deleteOne({ email: user.email })
                res.json({success:true})
            })
            .catch(() => {
                res.json({ err: "this email already registered!" })
            })

    } catch (error) {
        next(error);
    }
}

const sendOtp = async (req, res, next) => {
    try {
        //delete previous otp
        let email = req.body.email.trim();
        await OtpModel.deleteOne({ email: email })
        //generate new otp
        otp = Math.floor(100000 + Math.random() * 900000);
        let otpString = otp.toString()
        //req.session.otp = await bcrypt.hash(otpString,10)

        //generate validity of otp
        let now = new Date()
        let tenMin = new Date(now.getTime() + 10 * 60000)
        //store otp details in database
        await new OtpModel({
            email: email,
            otp: await bcrypt.hash(otpString, 10),
            expiry: tenMin
        }).save()
        //send otp using nodemailer
        await emailOtp.sendVerifyEmail(email, otp)
            .then(() => {
                res.json({ msg: "otp sent successfully" });
            }).catch(() => {
                res.json({ err: "otp sending failed" })
            })

    } catch (error) {
        next(error)
    }

}

const resetPassword = async (req, res, next) => {
    try {
        const email = req.body.email.trim()
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return res.json({ err: "user not found check emailid" })
        }
        let otpString = req.body.otp.trim()
        const otpData = await OtpModel.findOne({ email: email })

        const isOtp = await bcrypt.compare(otpString, otpData.otp);
        if (!isOtp) {
            return res.json({ err: "incorrect otp" })
        }
        if (new Date() > otpData.expiry) {
            return res.json({ err: "otp expired" })
        }

        await UserModel.updateOne(
            { email: email },
            {
                $set: {
                    password: await bcrypt.hash(req.body.password, 10)
                }
            }
        ).then(async (user) => {
            await OtpModel.deleteOne({ email: user.email })
            res.redirect('/login')
        })

    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const email = req.body.email.trim()
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return res.json({ err: "user not found check emailid!" })
        }

        const current = req.body.current_pass;
        const isPass = await bcrypt.compare(current, user.password);
        if (!isPass) {
            return res.json({ err: "incorrect password" })
        }

        await UserModel.updateOne(
            { email: email },
            {
                $set: {
                    password: await bcrypt.hash(req.body.new_pass, 10)
                }
            }
        ).then(() => {
            res.redirect('/login');
        })

    } catch (error) {
        next(error)
    }
}

const doLogin = async (req, res, next) => {
    try {
        const password = req.body.password;
        const user = await UserModel.findOne({ email: req.body.email.trim() });
        if (!user) {
            req.session.userLogin = false;
            req.session.userErr = "User dont exist";
            return res.redirect('/login')
        }
        if (user.blocked) {
            req.session.userLogin = false;
            req.session.userErr = "User is blocked";
            return res.redirect('/login')
        }
        req.session.userErr = "";
        const isPass = await bcrypt.compare(password, user.password);
        if (!isPass) {
            req.session.userLogin = false;
            req.session.passErr = "Wrong password";
            return res.redirect('/login')
        }
        req.session.passErr = "";

        req.session.username = user.fullname
        req.session.userId = user._id
        req.session.userLogin = true
        res.redirect('/')
    } catch (error) {
        next(error)
    }
}

const doLogout = async (req, res, next) => {
    try {
        req.session.userLogin = false
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        next(error)
    }
}

const searchProduct = async (req, res, next) => {
    try {
        const query = req.query.q || '';
        // const searchRegex = new RegExp(query, 'i')
        //similar to {$regex:query,$options:'i'}
        const Products = await ProductModel.find({
            flag: { $ne: true },
            $or: [
                { productName: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        })
        res.json(Products)
    } catch (error) {
        next(error)
    }
}

const getSubcategory = async (req, res, next) => {
    try {
        const categ = req.params.catId.trim();
        await Subcategory.find({
            $and: [
                { flag: { $ne: true } },
                { catId: categ }
            ]
        })
            .then((data) => {
                console.log("subcategories", data);
                res.json(data);
            })
    } catch (error) {
        next(error)
    }
}

const filterProduct = async (req, res, next) => {
    try {
        const categ = req.body.categ.trim() || '';
        const subcateg = req.body.subcateg.trim() || '';
        if (categ && subcateg) {
            await ProductModel.find(
                {
                    $and: [
                        { flag: { $ne: true } },
                        { catId: categ },
                        { subcatId: subcateg }
                    ]
                }).then((products) => {
                    res.json(products)
                    return;
                })
        } else if (categ) {
            await ProductModel.find({
                $and: [
                    { flag: { $ne: true } },
                    { catId: categ }
                ]
            }).then((products) => {
                res.json(products)
                return;
            })
        } else {
            await ProductModel.find()
                .then((products) => {
                    res.json(products);
                    return;
                })
        }

    } catch (error) {
        next(error)
    }
}

const addToWish = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const productId = req.params.id
        const Wishlist = await WishlistModel.findOne({ userId: userId });
        if (Wishlist) {
            const isProduct = await WishlistModel.findOne(
                {
                    $and:
                        [{ userId: userId },
                        {
                            wishItems:
                                { $elemMatch: { product: productId } }
                        }]
                })
            if (isProduct) {
                res.json({ status: false })
            } else {
                await WishlistModel.updateOne(
                    { userId },
                    {
                        $push:
                            { wishItems: { product: productId } }
                    }).then(() => {
                        res.json({ status: true })
                    }).catch((error) => {
                        next(error)
                    })
            }
        } else {
            const wishlist = new WishlistModel({
                userId,
                wishItems: { product: productId }
            })
            await wishlist.save()
                .then(() => {
                    res.json({ status: true })
                })
                .catch((error) => {
                    next(error)
                })
        }
    } catch (error) {
        next(error)
    }
}

const delFromWish = async (req, res, next) => {
    try {
        const itemId = req.params.id
        const userId = req.session.userId
        await WishlistModel.updateOne({ userId: userId }, { $pull: { wishItems: { _id: itemId } } })
            .then(() => {
                res.json({ remove: true })
            }).catch((error) => {
                next(error)
            })
    } catch (error) {
        next(error)
    }
}

const addToCart = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const productId = req.params.id
        const product = await ProductModel.findById({ _id: productId })
        const userCart = await CartModel.findOne({ userId: userId });
        if (userCart) {
            const isProduct = await CartModel.findOne(
                {
                    $and:
                        [{ userId: userId },
                        {
                            cartItems:
                                { $elemMatch: { product: productId } }
                        }]
                })
            if (isProduct) {
                res.json({ status: false })
            } else {
                await CartModel.updateOne(
                    { userId },
                    {
                        $push:
                        {
                            cartItems:
                                { product: productId, quantity: 1, price: product.srp }
                        }
                    }).then(() => {
                        res.json({ status: true });
                    }).catch((error) => {
                        next(error)
                    })
            }
        } else {
            const cartDetails = new CartModel({
                userId,
                cartItems: [{
                    product: productId,
                    quantity: 1,
                    price: product.srp
                }]
            })
            await cartDetails.save()
                .then(() => {
                    res.json({ status: true });
                })
                .catch((error) => {
                    next(error)
                })
        }
    } catch (error) {
        next(error)
    }
}

const delFromCart = async (req, res, next) => {
    try {
        const itemId = req.params.id
        await CartModel.updateOne({ userId: req.session.userId }, { $pull: { cartItems: { _id: itemId } } })
            .then(() => {
                res.json({ remove: true })
            }).catch((error) => {
                next(error)
            })
    } catch (error) {
        next(error)
    }
}

const changeItemQty = async (req, res, next) => {
    try {
        const userId = req.session.userId
        const itemId = req.body.item
        const productId = req.body.product
        const change = req.body.change
        const qty = req.body.qty
        const product = await ProductModel.findById({ _id: productId })
        if (change == -1 && qty == 1) {
            res.json({ remove: true, id: itemId })
            // await CartModel.updateOne(
            //     { userId: userId },
            //     {
            //         $pull: { cartItems: { _id: itemId } }
            //     }).then(() => {
            //         res.json({ remove: true })
            //     }).catch((error) => {
            //         next(error)
            //     })
        } else {
            await CartModel.findOneAndUpdate(
                {
                    $and:
                        [{ userId: userId },
                        { "cartItems.product": productId }]
                },
                {
                    $inc:
                        { "cartItems.$.quantity": change, "cartItems.$.price": product.srp * change }
                }
            ).then(async () => {
                let priceChange = product.srp * change
                const Cart = await CartModel.findOne({ userId: userId })
                    .populate('cartItems.product')
                    .lean();
                const subtotal = Cart.cartItems.map(item => item.price).reduce((acc, val) => acc + val, 0);
                res.json({ status: true, price: priceChange, total: subtotal });
            }).catch((error) => {
                next(error)
            })
        }
    } catch (error) {
        next(error)
    }
}

const countItem = async (req, res, next) => {
    try {
        const userId = req.session.userId
        const cart = await CartModel.findOne({ userId: userId })
        const wish = await WishlistModel.findOne({ userId: userId })
        // ?? nullish operator
        if (cart) {
            count.cart = cart.cartItems.length ?? 0
        } else {
            count.cart = 0
        }
        if (wish) {
            count.wish = wish.wishItems.length ?? 0
        } else {
            count.wish = 0
        }
        next()
    } catch (error) {
        next(error)
    }
}

const addAddress = async (req, res, next) => {
    try {
        const userId = req.session.userId
        await UserModel.updateOne(
            { _id: userId },
            {
                $push:
                    { addresses: req.body }
            }
        ).then(() => {
            res.redirect('/checkout')
        })
    } catch (error) {
        next(error)
    }
}

const updateAddress = async (req, res, next) => {
    try {
        await UserModel.updateOne(
            {
                _id: req.session.userId,
                "addresses._id": req.params.id
            },
            {
                $set: { "addresses.$": req.body }
            })
            .then(() => {
                res.redirect('/checkout')
            })
    } catch (error) {
        next(error)
    }
}

const deleteAddress = async (req, res, next) => {
    try {
        await UserModel.updateOne(
            {
                $and: [
                    { _id: req.session.userId },
                    { "addresses._id": req.params.id }
                ]
            },
            {
                $pull: { addresses: { _id: req.params.id } }
            })
            .then(() => {
                res.redirect('/checkout')
            })
    } catch (error) {
        next(error)
    }
}

const applyCoupon = async (req, res, next) => {
    try {
        let cpn_code = req.body.coupon.toUpperCase().trim();
        const coupon = await CouponModel.findOne({ code: cpn_code });

        if (!coupon) {
            return res.json({ err: "coupon not found" })
        }

        if(coupon.block){
            return res.json({err: "coupon is blocked"})
        }

        let date = coupon.validity;
        let now = new Date();

        if (date < now) {
            return res.json({ err: "coupon expired" })
        }

        const Cart = await CartModel.findOne({ userId: req.session.userId })
            .populate('cartItems.product', { _id: 1, srp: 1 })
            .lean();
        const subtotal = Cart.cartItems.map(item => item.price).reduce((acc, val) => acc + val, 0);

        if (subtotal < coupon.minBill) {
            return res.json({ err: `total bill should be $${coupon.minBill} or more` })
        }
        let discountAmt = subtotal * coupon.discount / 100;
        if (discountAmt >= coupon.maxDiscount) {
            discountAmt = coupon.maxDiscount;
        }
        let grandTotal = subtotal - discountAmt;
        grandTotal = grandTotal.toFixed(2)
        discountAmt = discountAmt.toFixed(2)
        return res.json({ grand: grandTotal, discount: discountAmt, message: `coupon ${coupon.code} applied` })

    } catch (error) {
        next(error)
    }
}

const placeOrder = async (req, res, next) => {
    try {
        //getting cart with populated product details
        const Cart = await CartModel.findOne({ userId: req.session.userId })
            .populate('cartItems.product', { _id: 1, srp: 1 })
            .lean();

        // maping cartItems to required format
        const items = Cart.cartItems.map(item => {
            const container = {
                product: item.product._id,
                price: item.product.srp,
                qty: item.quantity,
                total: item.price
            }
            return container
        })

        //manage out of stock
        let i = 0;
        for (i = 0; i < items.length; i++) {
            let product = await ProductModel.findOne({ _id: items[i].product })
            if (product.qty == 0) {
                return res.json({ err: `${product.productName} is out of stock` });
            } else if (product.qty < items[i].qty) {
                return res.json({ err: `${product.productName} is available only ${product.qty} quantity` })
            }
        }
        if (i == items.length) {
            console.log("creating order");
            const user = await UserModel.findOne(
                { _id: req.session.userId }
            ).catch((err) => {
                console.log("user error", err);
            })
            //getting address using address id
            const shipAddr = user.addresses.id(req.body.shipAddrId)
            const billAddr = user.addresses.id(req.body.billAddrId)
            //find coupon object
            let cpn_code = req.body.coupon.toUpperCase().trim();
            const couponObj = await CouponModel.findOne(
                { code: cpn_code }
            ).catch((err) => {
                console.log("coupon error", err);
            })
            //calculating subtotal,discount,grandtotal
            const subtotal = Cart.cartItems.map(item => item.price).reduce((acc, val) => acc + val, 0);
            console.log("total", subtotal);
            let discountAmt = 0;
            let grandTotal = subtotal;
            if (couponObj) {
                let date = couponObj.validity;
                let now = new Date();
                if (date < now || subtotal < couponObj.minBill) {
                    couponObj = null;
                } else {
                    discountAmt = subtotal * couponObj.discount / 100;
                    if (discountAmt >= couponObj.maxDiscount) {
                        discountAmt = couponObj.maxDiscount;
                    }
                    grandTotal = subtotal - discountAmt;
                    grandTotal = Number(grandTotal.toFixed(2))
                    discountAmt = Number(discountAmt.toFixed(2))
                }
            }
            console.log("discount", discountAmt);
            console.log("grandtotal", grandTotal);

            //creating the order with the given datas
            await new OrderModel({
                user: req.session.userId,
                shipAddress: shipAddr,
                billAddress: billAddr,
                "payment.method": req.body.payment,
                orderItems: items,
                subtotal: subtotal,
                coupon: couponObj,
                discount: discountAmt,
                grandtotal: grandTotal,
                orderStatus: req.body.payment === 'cod' ? "placed" : "pending",
                "deliveryStatus.placed.state": true,
                "deliveryStatus.placed.date": new Date
            }).save()
                .then(async (order) => {
                    manageStock(order)
                    if (req.body.payment === 'cod') {
                        await CartModel.deleteOne({ userId: req.session.userId })
                        console.log("cash on delivery");
                        return res.json({ cod: true });
                    } else {
                        console.log("online payment");
                        return res.json(
                            {
                                online: true,
                                total: order.subtotal,
                                discount: order.discount,
                                grandtotal: order.grandtotal,
                                orderId: order._id
                            })
                    }
                }).catch((err) => {
                    console.log("order error", err);
                })
        }
    } catch (error) {
        next(error)
    }
}

const manageStock = async (order) => {
    let items = order.orderItems;
    items.forEach(async (item) => {
        await ProductModel.updateOne(
            { _id: item.product },
            {
                $inc:
                    { qty: -(item.qty) }
            }
        )
    })
}

const cancelOrder = async (req, res, next) => {
    try {
        await OrderModel.updateOne(
            {
                $and:
                    [{ userId: req.session.userId },
                    { _id: req.params.id }]
            },
            {
                $set: { "deliveryStatus.cancelled.state": true, "deliveryStatus.cancelled.date": new Date }
            }
        ).then(() => {
            res.json({ cancel: true })
        })
    } catch (error) {
        next(error)
    }
}

const checkoutSession = async (req, res, next) => {
    try {
        const orderData = req.body;
        const user = await UserModel.findById({ _id: req.session.userId })

        //convert array of items to required format
        // const items = await Promise.all(
        //     itemsData.map(async (item) => {
        //         const product = await ProductModel.findById({ _id: item.product })
        //         const container = {
        //             price_data: {
        //                 currency: 'inr',
        //                 product_data: { name: product.productName },
        //                 unit_amount: item.price * 82.5 * 100
        //             },
        //             quantity: item.qty
        //         }
        //         return container
        //     })
        // )

        //create checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: "Grand Total" },
                    unit_amount: parseInt(orderData.grandtotal * 82.5 * 100)
                },
                quantity: 1
            }],
            customer_email: user.email,
            success_url:`${DOMAIN}/payment-success/${orderData.id}`,
            cancel_url:`${DOMAIN}/payment-cancel/${orderData.id}`
            //success_url: 'http://localhost:3000/payment-success/' + orderData.id,
            //cancel_url: 'http://localhost:3000/payment-cancel/' + orderData.id
        })
        // client_reference_id: orderData.id,
        console.log("<<Payment session>>\n", session);
        res.json({ url: session.url });
    } catch (error) {
        next(error)
    }
}

const paymentSuccess = async (req, res, next) => {
    try {
        await CartModel.deleteOne({ userId: req.session.userId })
        await OrderModel.updateOne(
            { _id: req.params.orderId },
            {
                $set: {
                    "payment.status": "success",
                    orderStatus: "placed"
                }
            })
        res.render('user/payment-success')
    } catch (error) {
        next(error)
    }
}

const paymentCancel = async (req, res, next) => {
    try {
        await OrderModel.deleteOne({ _id: req.params.orderId })
        res.render('user/payment-cancel')
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signupPage,
    forgotPage,
    loginPage,
    homePage,
    shopPage,
    productPage,
    resetPage,
    ordersPage,
    wishlistPage,
    profilePage,
    couponsPage,
    cartPage,
    checkoutPage,
    addressPage,
    editaddressPage,
    orderSuccess,
    checkoutSession,
    paymentPage,
    paymentSuccess,
    paymentCancel,
    sendOtp,
    changePassword,
    resetPassword,
    doSignup,
    doLogin,
    doLogout,
    searchProduct,
    getSubcategory,
    filterProduct,
    addToWish,
    delFromWish,
    addToCart,
    delFromCart,
    changeItemQty,
    countItem,
    addAddress,
    updateAddress,
    deleteAddress,
    applyCoupon,
    placeOrder,
    orderDetails,
    cancelOrder
}