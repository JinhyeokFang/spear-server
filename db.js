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
                crypto.decrypt({nickname: res.nickname}, resul => {
                    callback({ message: "login complete", nickname: resul.nickname });
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
                    new userModel({username: result.username, password: result.password, nickname: result.nickname, skill1Array: [4,3,2,1], skill2Array: [1,2,3,4], friendsArray: [], friendsRequestArray: [], rate: "0"}).save(err => {
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
    crypto.encrypt(data, result => {
        userModel.findOne({username: result.username}, (err, res) => {
            if (err)
                callback({ message: "getSkill failed", err });
            else if (res == null)
                callback({ message: "getSkill failed", err: "userNotFound"});
            else
                callback({ message: "getSkill complete", skill1Array: res.skill1Array, skill2Array: res.skill2Array});
        });
    });
};

exports.setSkill = (data, callback) => {
    crypto.encrypt({username: data.username}, result => {
        userModel.findOneAndUpdate({username: result.username}, {skill1Array: data.skill1Array, skill2Array: data.skill2Array}, err => {
            if (err)
                callback({ message: "setSkill failed", err});
            else
                callback({ message: "setSkill complete", err: null });
	
        });
    });
};

exports.friendRequest = (data, callback) => {
    userModel.findOne(data, (err, res) => {
        if (res == null) {
            callback({ message: "request failed", err: "user not found" });
        } else {
            let friendsRequestArray = res.friendsRequestArray;
            friendsRequestArray.push(data.reqNickname);
            userModel.findOneAndUpdate(data, {friendsRequestArray}, error => {
                if (err || error)
                    callback({ message: "request failed", err, error});
                else
                    callback({ message: "request complete"});
            });
        }
    });
};

exports.getFriendsList = (data, callback) => {
    crypto.encrypt(data, result => {
        userModel.findOne({username: result.username}, (err, res) => {
            if (err)
                callback({ message: "getFriendsList failed", err });
            else if (res == null)
                callback({ message: "getFriendsList failed", err: "user not found"});
            else
                callback({ message: "getFriendsList complete", friendsList: res.friendsArray});
        });
    });
};

exports.getFriendRequestList = (data, callback) => {
    crypto.encrypt(data, result => {
        userModel.findOne({username: result.username}, (err, res) => {
            if (err)
                callback({ message: "getFriendRequestList failed", err });
            else if (res == null)
                callback({ message: "getFriendRequestList failed", err: "user not found"});
            else
                callback({ message: "getFriendRequestList complete", friendRequestList: res.friendsRequestArray});
        });
    });
};

exports.acceptFriendRequest = (data, callback) => {
    crypto.encrypt(data, result => {
        userModel.findOne({username: result.username}, (err, res) => {
            let friendsRequestArray = res.friendsRequestArray;
            let friendsArray = res.friendsArray;
            let friend = friendsRequestArray[data.requestNumber];
            friendsRequestArray.splice(data.requestNumber, 1);
            friendsArray.push(friend);

            userModel.findOneAndUpdate({username: result.username}, {friendsArray, friendsRequestArray}, err => {
                userModel.findOne({nickname: friend}, (err, resp) => {
                    let friendsArray = resp.friendsArray;
                    friendsArray.push(res.nickname);
                    userModel.findOneAndUpdate({nickname: friend}, {friendsArray}, err => {
                        callback({ message: "acceptFriendRequest complete"});
                    });
                });
            });
        });
    });
};

exports.setRate = (data, callback) => {
    crypto.encrypt(data, result => {
        userModel.findOneAndUpdate({username: result.username}, {rate: data.rate}, err => {
            callback({ message: "acceptFriendRequest complete"});
        });
    });
};