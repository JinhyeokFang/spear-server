const crypto = require("crypto");
const config = require("../config");

exports.encrypt = (string, callback) => {
    const cipher = crypto.createCipher("aes-128-cbc". config.key);
    let result = cipher.update(string, "utf8", "base64");
    result += cipher.final("base64");
    callback(result);
};

exports.decrypt = (data, callback) => {
    const decipher = crypto.createDecipher("aes-256-cbc", config.key);
    let result = decipher.update(data, "base64", "utf8");
    result += decipher.final("utf8");
    callback(result);
};