const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.connect = id => {
    connectedUsersInfo.createUser(id);
};

exports.disconnect = id => {
    connectedUsersInfo.removeUserBySocketId(id);
};