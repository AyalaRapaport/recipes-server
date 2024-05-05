const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true, minlength: 4 },
    email: { type: String, required: true, unique: true }
})
module.exports.Users = mongoose.model('users', userSchema)