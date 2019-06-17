const mongoose = require("mongoose");
const userModel = require("./model/userMogooseModel");
const crypto = require("./modules/crypto");

exports.initialize = config => {
    mongoose.connect(`mongodb://localhost/${config.name}`, {
        useNewUrlParser: true
    });
};

exports.login = (data, callback) => {
    crypto.encrypt(data.password, password => {
        data.password = password;
        userModel.findOne(data, (err, res) => {
            if (err) {
                callback({ message: "login failed", err });
            } else if (res == null) {
                callback({ message: "login failed", err: "user not found" });
            } else {
                callback({ message: "login complete", err, nickname: data.nickname });
            }
        });
    });
};

exports.register = (data, callback) => {
    crypto.encrypt(data.password, password => {
        userModel.findOne({username: data.username}, (err, res) => {
            userModel.findOne({nickname: data.nickname}, (error, response) => {
                if (err || error) {
                    callback({ message: "register failed", err: (err | error) });
                } else if (response != null) {
                    callback({ message: "register failed", err: "same nickname is already exist"});
                } else if (res == null) {
                    new userModel({username: data.username, password, nickname: data.nickname, skill1Array: [4,3,2,1], skill2Array: [1,2,3,4]}).save(err => {
                        if (err)
                            callback({ message: "register failed", err });
                        else
                            callback({ message: "register complete" });
                    });
                } else {
                    callback({ message: "register failed", err: "same username is already exist" });
                }
            });
        });
    });
};

exports.getSkill = (data, callback) => {
    userModel.findOne({username: data.username}, (res, err) => {
        if (err)
            callback({ message: "getSkill failed", err });
        else if (res == null)
            callback({ message: "getSkill failed", err: "userNotFound"});
        else
            callback({ message: "getSkill complete", skill1Array: data.skill1Array, skill2Array: data.skill2Array, err: null});
    });
};

exports.setSkill = (data, callback) => {
    userModel.findOneAndUpdate({username: data.username}, {skill1Array: data.skill1Array, skill2Array: data.skill2Array}, err => {
        if (err)
            callback({ message: "setSkill failed", err});
        else
            callback({ message: "setSkill complete", err: null });
    });
};