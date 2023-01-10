const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId


const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    }
})

const subcategorySchema = new mongoose.Schema({
    cat_id:{
        type: Objectid,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    flag:{
        type: Boolean,
        default: false
    }
})

const brandSchema = new mongoose.Schema({
    subcat_id:{
        type: Objectid,
        required: true
    },
    brand: {
        type: String,
        required: true
    }
})

let category = mongoose.model('Category',categorySchema);
let subcategory = mongoose.model('Subcategory',subcategorySchema);
let brand = mongoose.model('Brand',brandSchema);

module.exports = {category,subcategory,brand}
