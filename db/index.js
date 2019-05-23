const mongoose = require("mongoose");
const userModel = require("../model/userMogooseModel");

exports.initialize = dbName => {
    mongoose.connect(`mongodb://localhost/${dbName}`, {
        useNewUrlParser: true
    });
};

exports.login = (data, callback) => {
    userModel.findOne(data, (err, res) => {
        if (err) {
            callback({ message: "login failed", err });
        } else if (res == null) {
            callback({ message: "login failed" });
        } else {
            callback({ message: "login complete", err });
        }
    });
};

exports.register = (data, callback) => {
    userModel.findOne({username: data.username}, (err, res) => {
        if (err) {
            callback({ message: "register failed", err });
        } else if (res == null) {
            new userModel({username: data.username, password: data.password, nickname: data.nickname, skill1Array: [], skill2Array: []}).save(err => {
                if (err)
                    callback({ message: "register failed", err });
                else
                    callback({ message: "register complete" });
            });
        } else {
            callback({ message: "register failed", err });
        }
    });
};

exports.update = (data, callback) => {
    userModel.update({username: data.username}, data, (res, err) => {
        if (err)
            callback({ message: "update failed", err });
        else
            callback({ message: "update complete" });
    });
};