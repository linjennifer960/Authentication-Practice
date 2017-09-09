var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//take passport local mongoose package that we required, which add methods that come with it
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);