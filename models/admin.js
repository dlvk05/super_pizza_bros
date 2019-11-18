var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/super_pizza_bros");
var passportLocalMongoose = require("passport-local-mongoose");

// SCHEMA SETUP
var adminSchema = new mongoose.Schema({
    username:String,
    password:String,
});
var admin = mongoose.model("Admins",adminSchema);

// admin.create({
//         username:"",
//         password:"password",
//     },
//     (err,pizza)=>{
//         if(err)
//             console.log(err);
//         else
//             console.log(pizza);
//     });
    
adminSchema.plugin(passportLocalMongoose);  /* OKK adds methods of passportlocalmongoose */



module.exports = admin;