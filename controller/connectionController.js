const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.connect = id => {
    connectedUsersInfo.createUser(id);
};

exports.disconnect = (id, callback) => {
    connectedUsersInfo.removeUserBySocketId(id, callback);
};

exports.getUsers = () => connectedUsersInfo.userList;