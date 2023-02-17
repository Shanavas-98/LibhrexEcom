require('../config/connection');
require('dotenv').config()
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const sendOtp = require("../utils/nodemailer");
const stripe = require('stripe')(process.env.SECRET_KEY);

const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const CartModel = require("../models/cartModel");
const WishlistModel = require("../models/wishlistModel");
const OrderModel = require("../models/orderModel");
const CouponModel = require('../models/couponModel');

const Category = CategoryModel.category;
const Subcategory = CategoryModel.subcategory;
const ObjectId = mongoose.Types.ObjectId;

let userErr = "";
let passErr = "";
let otp = "";
let count = { cart: 0, wish: 0 }

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
        return res.render('user/index', { title: "Home", login: req.session, Products, count });
    } catch (error) {
        next(error)
    }
}

const shopPage = async (req, res, next) => {
    try {
        console.log("<<shop page rendering>>");
        const Categories = await Category.find()
        const Subcategories = await Subcategory.find({ flag: { $ne: true } })
        const Products = await ProductModel.find({ flag: { $ne: true } })
        res.render('user/shop', { title: "Shop", login: req.session, Categories, Subcategories, Products, count })
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
                { cat_id: product.cat_id },
                { _id: { $ne: productId } }
            ]
        }).limit(4)
        res.render('user/product', { title: "Product", login: req.session, product, related, count })
    } catch (error) {
        next(error)
    }
}

const profilePage = async (req, res, next) => {
    console.log("<<profile page rendering>>");
    try {
        console.log(req.session.userId);
        const user = await UserModel.findOne({ _id: req.session.userId });
        res.render('user/profile', { title: "Profile", login: req.session, user, count })
    } catch (error) {
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
        const subtotal = Cart.cartItems.map(item => item.price).reduce((acc, val) => acc + val, 0);
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
        const orders = await OrderModel.find({ user: req.session.userId })
            .populate('orderItems.product')
            .sort({ orderDate: -1 })
            .lean()
        res.render('user/orders', { title: "Orders", login: req.session, count, orders })
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

const couponsPage = async(req,res,next)=>{
    try {
        await CouponModel.find()
        .then((coupons)=>{
            res.render('user/coupons', { title: "Coupons", login: req.session, count, coupons })
        })
        
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
                .catch((error) => {
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
        req.session.userLogin = false
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        next(error)
    }
}

const addToWish = async (req, res, next) => {
    try {
        console.log("<<< add Wishlist works >>>");
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
                await CartModel.findOneAndUpdate(
                    {
                        $and:
                            [{ userId: userId },
                            { "cartItems.product": productId }]
                    },
                    {
                        $inc: { "cartItems.$.quantity": 1, "cartItems.$.price": product.srp }
                    }
                ).then(() => {
                    res.json({ status: false });
                }).catch((error) => {
                    next(error)
                })
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
            await CartModel.updateOne({
                userId: userId
            },
                {
                    $pull: { cartItems: { _id: itemId } }
                }).then(() => {
                    res.json({ remove: true })
                }).catch((error) => {
                    next(error)
                })
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
        console.log("update address", req.body);
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

const placeOrder = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ _id: req.session.userId })
        const shipAddr = user.addresses.id(req.body.shipAddrId)
        const billAddr = user.addresses.id(req.body.billAddrId)
        const Cart = await CartModel.findOne({ userId: req.session.userId })
            .populate('cartItems.product', { _id: 1, srp: 1 })
            .lean();
        const subtotal = Cart.cartItems.map(item => item.price).reduce((acc, val) => acc + val, 0);
        // const Items = Cart.cartItems;
        const items = Cart.cartItems.map(item => {
            const container = {
                product: item.product._id,
                price: item.product.srp,
                qty: item.quantity,
                total: item.price
            }
            return container
        })
        await new OrderModel({
            user: req.session.userId,
            shipAddress: shipAddr,
            billAddress: billAddr,
            "payment.method": req.body.payment,
            orderItems: items,
            subtotal: subtotal,
            orderStatus: req.body.payment === 'cod' ? "placed" : "pending",
            "deliveryStatus.ordered.state": true,
            "deliveryStatus.ordered.date": new Date

        }).save()
            .then(async (response) => {
                if (req.body.payment === 'cod') {
                    await CartModel.deleteOne({ userId: req.session.userId })
                    console.log("cash on delivery");
                    res.json({ status: true });
                } else {
                    console.log("online payment");
                    res.json({ status: false, items: items, orderId: response._id })
                }
            })
    } catch (error) {
        next(error)
    }
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
        //get user details

        const user = await UserModel.findById({ _id: req.session.userId })

        //convert array of items to required format

        const items = await Promise.all(
            req.body.map(async (item) => {
                const product = await ProductModel.findById({ _id: item.product })
                const container = {
                    price_data: {
                        currency: 'inr',
                        product_data: { name: product.productName },
                        unit_amount: item.price * 86 * 100
                    },
                    quantity: item.qty
                }
                return container
            })
        )

        //create checkout session

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: items,
            customer_email: user.email,
            client_reference_id: req.params.orderId,
            success_url: 'http://localhost:3000/payment-success/' + req.params.orderId,
            cancel_url: 'http://localhost:3000/payment-cancel/' + req.params.orderId
        })
        console.log(session);
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
    verifyPage,
    loginPage,
    homePage,
    shopPage,
    productPage,
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
    getOtp,
    verifyUser,
    doSignup,
    doLogin,
    doLogout,
    addToWish,
    delFromWish,
    addToCart,
    delFromCart,
    changeItemQty,
    countItem,
    addAddress,
    updateAddress,
    deleteAddress,
    placeOrder,
    orderDetails,
    cancelOrder
}