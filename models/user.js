var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/super_pizza_bros");
var passportLocalMongooe = require("passport-local-mongoose");

// SCHEMA SETUP
var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
});

UserSchema.plugin(passportLocalMongooe);  /* OKK adds methods of passportlocalmongoose */

var user = mongoose.model("Users",UserSchema);

module.exports = user;