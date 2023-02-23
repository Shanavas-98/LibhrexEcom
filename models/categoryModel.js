const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        unique: true,
        required: true
    }
})

const subcategorySchema = new mongoose.Schema({
    catId:{
        type: ObjectId,
        required: true
    },
    subcategory: {
        type: String,
        unique: true,
        required: true
    },
    flag:{
        type: Boolean,
        default: false
    }
})

const brandSchema = new mongoose.Schema({
    subcatId:{
        type: ObjectId,
        required: true
    },
    brand: {
        type: String,
        unique:true,
        required: true
    }
})

let category = mongoose.model('Category',categorySchema);
let subcategory = mongoose.model('Subcategory',subcategorySchema);
let brand = mongoose.model('Brand',brandSchema);

module.exports = {category,subcategory,brand}
