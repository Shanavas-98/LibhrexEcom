
const bcrypt = require('bcrypt');
const db = require('../config/connection');
const session = require('express-session');
const mongoose = require('mongoose');

const sendOtp = require("../utils/nodemailer");

const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const CartModel = require("../models/cartModel");
const WishlistModel = require("../models/wishlistModel")



const Category = CategoryModel.category;
const Subcategory = CategoryModel.subcategory;
const ObjectId = mongoose.Types.ObjectId;

let userErr = "";
let passErr = "";
let otp = "";
let count = {}

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

const ordersPage = async (req, res, next) => {
    try {
        res.render('user/orders', { title: "Orders", login: req.session, count })
    } catch (error) {
        next(error)
    }
}

const profilePage = async (req, res, next) => {
    console.log("<<profile page rendering>>");
    try {
        console.log(req.session.userId);
        const user = await UserModel.findOne({ _id: req.session.userId });
        res.render('user/user-profile', { title: "Profile", login: req.session, user, count })
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
        let Cart = await CartModel.findOne({ userId: userId })
            .populate('cartItems.product')
            .lean();
        if (Cart) {
            const subtotal = Cart.cartItems.map(item => item.price).reduce((acc, val) => acc + val, 0);
            let Items = Cart.cartItems;
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
        res.render('user/checkout', { title: "Checkout", login: req.session, count })
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
                res.json({ status: true })
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
                        $inc: { "cartItems.$.quantity": 1 }
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
        const quantity = await CartModel.findOne(
            {$and:
                [{ userId: userId },
                { "cartItems.product": productId }]
            },
            { "cartItems.quantity":1 })
            
        const qty = quantity.cartItems[0].quantity
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
                        { "cartItems.$.quantity": change }
                }
            ).then(() => {
                res.json({ status: true });
            }).catch((error) => {
                next(error)
            })
        }
    } catch (error) {
        next(error)
    }
}

const Count = async (req, res, next) => {
    try {
        const userId = req.session.userId
        const cart = await CartModel.findOne({ userId: userId })
        const wish = await WishlistModel.findOne({ userId: userId })
        // ?? nullish operator
        if (cart) {
            count.cart = (cart.cartItems.length ?? 0)
        }
        if (wish) {
            count.wish = (wish.wishItems.length ?? 0)
        }
        next()
    } catch (error) {
        next(error)
    }
}

// const cartTotal = async(req, res, next)=>{
//     const cart = CartModel.findOne({ userId: req.session.userId })
//     .populate('cartItems.product')
//     .exec(function (err, cart) {
//         if (err) next(err);
//         const subtotal = cart.cartItems.map(item => item.product.srp * item.quantity).reduce((acc, val) => acc + val, 0);
//         return subtotal
//     });
// }



// Get Cart Total
// const getCartTotal = async (req, res, next) => {
//     try {
//         userId = req.session.userId
//         const Cart = await CartModel.aggregate([
//             {
//                 $match: { _id: ObjectId(userId) }
//             },
//             {
//                 $unwind: '$Cart.cartItems'
//             },
//             {
//                 $project: {
//                     product: '$Cart.cartItems.product',
//                     quantity: '$Cart.cartItems.quantity'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'cartItems',
//                     localField: 'product',
//                     foreignField: '_id',
//                     as: 'product'
//                 }
//             },
//             {
//                 $project: { _id: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] } }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     total: { $sum: { $multiply: ["$quantity", "$product.price"] } }
//                 }
//             }
//         ]);
//         console.log(Cart);
//         next()
//         if (Cart.length) {
//             return user[0].total;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         next(error)
//     }
// }

// // Add New Address
// const addNewAddress = async (data, userId) => {
//     try {
//         data.default = false;
//         data.id = Date.now() + '-' + Math.round(Math.random() * 1E9);

//         const user = await UserModel.findByIdAndUpdate(userId, {
//             $push: { address: data }
//         }, { new: true });

//         return user;
//     } catch (err) {
//         throw new Error(err);
//     }
// }


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
    cartPage,
    checkoutPage,
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
    Count
}