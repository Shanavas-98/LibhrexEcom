
const bcrypt = require('bcrypt');
const db = require("../config/connection");

const AdminModel = require("../models/adminModel");

module.exports = {

    Home: async(req,res,next)=>{
        console.log("homepage");
        try{
            res.render('admin/dashboard')
        }catch(error){
            next(error)
        }
    },


}