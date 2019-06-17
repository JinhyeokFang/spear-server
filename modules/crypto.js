const crypto = require("crypto");
const config = require("../config");

exports.encrypt = (obj, callback) => {
    for (let stringIndex in obj) {
        if (typeof obj[stringIndex] == Array)
            break;
        const cipher = crypto.createCipher("aes-256-cbc", config.key);
        let data = cipher.update(obj[stringIndex], "utf8", "base64");
        data += cipher.final("base64");
        obj[stringIndex] = data;
    }
    callback(obj);
};

exports.decrypt = (obj, callback) => {
    for (let stringIndex in obj) {
        if (typeof obj[stringIndex] == Array)
            break;
        const decipher = crypto.createDecipher("aes-256-cbc", config.key);
        let data = decipher.update(obj[stringIndex], "base64", "utf8");
        data += decipher.final("utf8");
        obj[stringIndex] = data;
    }
    callback(obj);
};