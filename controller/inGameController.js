const connectedUsersInfo = require('../model/connectedUsersInfoInstanceModel').getInstance()

exports.enter = (id, roomid) => {
    let result = connectedUsersInfo.enterGameRoomBySocketId(id, roomid)
    if(result.err != undefined)
        throw new Error(err)
}

exports.quit = (id) => {
    connectedUsersInfo.quitGameRoomBySocketId(id)
}