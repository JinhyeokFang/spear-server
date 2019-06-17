const mongoose = require("mongoose");
const userModel = require("./model/userMogooseModel");
const crypto = require("./modules/crypto");

exports.initialize = config => {
    mongoose.connect(`mongodb://localhost/${config.name}`, {
        useNewUrlParser: true
    });
};

exports.login = (data, callback) => {
    crypto.encrypt(data, result => {
        userModel.findOne(result, (err, res) => {
            if (err) {
                callback({ message: "login failed", err });
            } else if (res == null) {
                callback({ message: "login failed", err: "user not found" });
            } else {
                console.log(result.nickname, result);
                crypto.decrypt({nickname: result.nickname}, result => {
                    callback({ message: "login complete", nickname: result.nickname });
                });
            }
        });
    });
};

exports.register = (data, callback) => {
    crypto.encrypt(data, result => {
        userModel.findOne({username: result.username}, (err, res) => {
            userModel.findOne({nickname: result.nickname}, (error, response) => {
                if (err || error) {
                    callback({ message: "register failed", err: (err | error) });
                } else if (response != null) {
                    callback({ message: "register failed", err: "same nickname is already exist"});
                } else if (res == null) {
                    new userModel({username: result.username, password: result.password, nickname: result.nickname, skill1Array: [4,3,2,1], skill2Array: [1,2,3,4]}).save(err => {
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
    },);
};

exports.getSkill = (data, callback) => {
    crypto.encrypt(data, result => {
        userModel.findOne({username: result.username}, (res, err) => {
            if (err)
                callback({ message: "getSkill failed", err });
            else if (res == null)
                callback({ message: "getSkill failed", err: "userNotFound"});
            else
                callback({ message: "getSkill complete", skill1Array: res.skill1Array, skill2Array: res.skill2Array, err: null});
        });
    });
};

exports.setSkill = (data, callback) => {
    crypto.encrypt(data, result => {
        userModel.findOneAndUpdate({username: result.username}, {skill1Array: data.skill1Array, skill2Array: data.skill2Array}, err => {
            if (err)
                callback({ message: "setSkill failed", err});
            else
                callback({ message: "setSkill complete", err: null });
        });
    });
};