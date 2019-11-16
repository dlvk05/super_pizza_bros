var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/super_pizza_bros");

// ORDER SCHEMA

var orderSchema= new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    mobileNo:String,
    address:String,
    pinCode:String,
    cart:[
        {
            name:String,
            ingredients:[],
            size:String,
            price:Number,
            image:String,
            quantity:Number,
        }
    ],
    grandTotal:Number
});

var order = mongoose.model("Order",orderSchema);

module.exports = order;