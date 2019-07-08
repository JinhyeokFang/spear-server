const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	username: String,
    password: String,
    nickname: String,
    skill1Array: Array,
    skill2Array: Array,
    friendsArray: Array,
    friendsRequestArray: Array,
    rate: String
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;