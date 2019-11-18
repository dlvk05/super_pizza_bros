var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/super_pizza_bros");

// SCHEMA SETUP

var userDetailSchema = new mongoose.Schema({
    username:String,
    firstName:String,
    lastName:String,
    email:String,
    mobileNo:String,
    address:String,
    pinCode:String,
});

var userDetail = mongoose.model("userDetails",userDetailSchema);

// pizza.create({
//     name:"Pepper & Onion",
//     image:"https://images.dominos.co.in/pizza_mania_paneer_onion.png",
//     ingredients:["onion","creamy paneer"],
//     detail:{
//         "regular":95,
//         "medium":150,
//         "large":300
//     }
// },
// (err,pizza)=>{
//     if(err)
//         console.log(err);
//     else
//         console.log(pizza);
// });

module.exports = userDetail;