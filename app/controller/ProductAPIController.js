const { ProductModel, UserModel } = require('../model/ProductModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let loginDetails = [{
    username: "admin",
    password: "$2b$10$eqjBGUROWsTExuS3LX1NOuq6U4fKcqcGakBtnHNq0SOn9iSh7PdVi",
    _id: "aghd767673n#mn87883jhdjhdjfhd"
},
{
    username: "Pallavi",
    password: "PallaviNG"
},
    // {
    //     username:"admin",
    //     password:"abc123"
    // }
];

var ProductAPIController = {
    home: function (req, res) {
        res.status(200).send({ status: true });
    },
    saveNewProduct: async function (req, res) {
        var data = req.body;
        try {
            const product = new ProductModel({
                product_name: data.product_name,
                product_price: data.product_price
            });
            const result = await product.save();
            res.status(200).send({ status: true, inserted: result, message: "inserted record successfully..." });
        } catch (error) {
            res.status(500).send({ status: false, error });
        }
    },
    productList: async function (req, res) {
        try {
            var result = await ProductModel.find({}, { __v: 0 });
            res.status(200).send({ status: true, list: result });
        } catch (error) {
            res.status(501).send({ status: false, error });
        }
    },
    removeProduct: async function (req, res) {
        var id = req.body.id;
        try {
            let { deletedCount } = await ProductModel.deleteOne({ _id: id });
            res.status(200).send({ status: 1, result: deletedCount });
        } catch (error) {
            res.status(501).send({ status: 0, error });
        }
    },
    updateProduct: async function (req, res) {
        var data = req.body;
        try {
            let result = await ProductModel.updateOne({ _id: data._id },
                {
                    $set: {
                        product_name: data.product_name,
                        product_price: data.product_price
                    }
                });
            res.status(200).send({ status: 1, result });
        }
        catch (error) {
            res.status(501).send({ status: 0, error });
        }
    },
    addNewUser: async function (req, res) {
        let userData = req.body;
        try {
            let userCount = await UserModel.findOne({
                username: userData.username
            }).count();
            if (userCount > 0) {
                res.status(200).send({ status: 0, message: "user already exists" });
            } else {
                let salt = await bcrypt.genSalt(10);
                let newPassword = await bcrypt.hash(userData.password, salt)
                let user = new UserModel({
                    username: userData.username,
                    password: newPassword
                });
                var result = await user.save();
                let token = jwt.sign({
                    username: result.username,
                    id: result._id
                }, process.env.PRIVATE_KEY);
                // }, "private");
                res.header('x-auth-token', token);
                res.status(200).send({ status: 1 });
            }
        } catch (error) {
            res.status(500).send({ status: 0, error });
        }
    },
    checkLogin: async function (req, res) {
        // var data = req.body;
        // res.status(200).send({status:true,data});

        /*var password = "admin@123";
        try {
            var salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password,salt);
            res.status(200).send({data:password,salt});
        } catch (error) {
            res.status(500).send({status:0,error});
        }*/


        let data = req.body;
        try {
            let user = await UserModel.findOne({ username: data.username });
            // console.log(user.password);
            if (user) {

                let result = await bcrypt.compare(data.password, user.password);
                if (result === true) {
                    let token = jwt.sign({ username: user.username, id: user._id }, process.env.PRIVATE_KEY);
                    res.header('x-auth-token', token);
                    res.status(200).send({ status: 1 ,result});
                }
                else
                    res.status(400).send({ status: 0, message: 'invalid password' });
            }
            else {
                res.status(200).send({ status: 0, message: 'user not found' })
            }
        } catch (error) {
            res.status(500).send({ status: 0, error });
        }
    }
};

module.exports = ProductAPIController;