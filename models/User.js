const mongoose = require("mongoose")
const {Schema} = require('mongoose');
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

const UserSchema = new Schema({
    fullname: String,
    email: String,
    gender: String,
    phone: String,
    isDel: {
        type: Boolean,
        default: false
    },
    salt: String,
    hash: String
});

//Generating the token
UserSchema.methods.generateToken = function(){
    return jwt.sign({
        _id: this._id,
        fullname: this.fullname,
        email: this.email
    }, "ABCD")
}

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString("hex"); // It generates a random 16 byte hexadecimal string which is unique for every user.
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 1000, "sha512").toString("hex")  // This is used for encrypting password and salt.

}

UserSchema.methods.validatePassword = function(password){
    var newhash = crypto.pbkdf2Sync(password, this.salt, 1000, 1000, "sha512").toString("hex")
    return this.hash === newhash
}


module.exports = UserSchema;