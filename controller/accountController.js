const db = require("../db");
const crypto = require("../modules/crypto");
const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.login = (req, res) => {
    db.login(req, resu => {
        if (resu.message != "login failed") {
            crypto.decrypt({username: req.username}, result => {
                if (connectedUsersInfo.loginUserBySocketId(res.socket.id, result.username, req.nickname) == undefined)
                    res.socketSend(res.socket, "loginCallback", resu);
                else
                    res.socketSend(res.socket, "loginCallback", { message: "login failed", err: "the user already logined" });

            });
        } else {
            res.socketSend(res.socket, "loginCallback", resu);
        }
    });
};

exports.register = (req, res) => {
    db.register(req, result => {
        res.socketSend(res.socket, "registerCallback", result);
    });
};

exports.setSkill = (req, res) => {
    db.setSkill(req, result => {
        
    });
};

exports.getSkill = (req, res) => {
    db.getSkill(req, result => {
        res.socketSend(res.socket, "getSkillCallback", result);
    });
};

exports.sendFriendRequest = (req, res) => {
    db.friendRequest(req, result => {
        res.socketSend(res.socket, "sendFriendRequestCallback", result);
    });
};

exports.getFriendRequestList = (req, res) => {
    db.getFriendRequestList(req, result => {
        res.socketSend(res.socket, "getFriendRequestListCallback", result);
    });
};

exports.acceptFriendRequest = (req, res) => {
    db.acceptFriendRequest(req, result => {
        res.socketSend(res.socket, "acceptFriendRequestCallback", result);
    });
};

exports.getFriendsList = (req, res) => {
    db.getFriendsList(req, result => {
        res.socketSend(res.socket, "getFriendsListCallback", result);
    });
};

exports.setRate = (req, res) => {
    db.setRate(req, result => {

    });
};