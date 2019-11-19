var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/super_pizza_bros");
var passportLocalMongoose = require("passport-local-mongoose");

// SCHEMA SETUP
var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{type:Boolean,default:false}
});

UserSchema.plugin(passportLocalMongoose);  /* OKK adds methods of passportlocalmongoose */

var user = mongoose.model("Users",UserSchema);

module.exports = user;