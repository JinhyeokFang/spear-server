const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
	username: String,
    password: String,
    skillArray: Array
})
const userModel = mongoose.model("user", userSchema)

module.exports = userModel