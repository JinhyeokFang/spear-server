const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.enter = (id, roomid, callback) => {
    let result = connectedUsersInfo.enterGameRoomBySocketId(id, roomid);
    callback(result.err);
};

exports.quit = (id, callback) => {
    connectedUsersInfo.quitGameRoomBySocketId(id);
    callback();
};

exports.move = (x, y, id) => {
    connectedUsersInfo.moveUserPositionBySocketId(x, y, id);
};

exports.skill = (number, id) => {
    console.info(number, id);
};