const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.enter = (id, roomid) => {
    let result = connectedUsersInfo.enterGameRoomBySocketId(id, roomid);
    if(result.err != null)
        throw new Error(result.err);
};

exports.quit = id => {
    connectedUsersInfo.quitGameRoomBySocketId(id);
};

exports.move = (x, y, id) => {
    connectedUsersInfo.moveUserPositionBySocketId(x, y, id);
};