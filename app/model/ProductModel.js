let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ProductSchema = new Schema({
    product_name: String,
    product_price: Number
});

let UserSchema = new Schema({
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true }
});

let ProductModel = mongoose.model('ProductList', ProductSchema);
let UserModel = mongoose.model('User', UserSchema);
module.exports = { ProductModel, UserModel };