const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.enter = (req, res) => {
    let result = connectedUsersInfo.enterGameRoomBySocketId(res.socket.id);
    let users = connectedUsersInfo.getUsersByRoomid(result.roomid);

    if (result.err != null) {
        res.socketSend(res.socket, "enterCallback", { message: "enter failed", err: result.err});
    } else {
        if (users.length >= 2)
            res.socketSend(res.socket, "enterCallback", { message: "enter complete", roomid: result.roomid, users, startGame: true});
        else
            res.socketSend(res.socket, "enterCallback", { message: "enter complete", roomid: result.roomid, users, startGame: false});
    }

    if(users.length >= 2) {
        users.forEach(user => res.ioSend(res.io, user.id, "gamestart"));
    }
};

exports.enterCancel = (req, res) => {
    let result = connectedUsersInfo.enterCancelBySocketId(res.socket.id);
    if(result.err != null)
        res.socketSend(res.socket, "enterCancelCallback", { message: "enterCancel failed", err: result.err});
    else
        res.socketSend(res.socket, "enterCancelCallback", { message: "enterCancel complete"});
};

exports.quit = (req, res) => {
    connectedUsersInfo.quitGameRoomBySocketId(res.socket.id);
    res.socketSend(res.socket, "enterCancelCallback", { message: "enterCancel complete"});
};

exports.skill = (req, res) => {
    let newData = req;

    if (connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(res.socket.id).roomid) == undefined)
        return;

    let opponent = connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(res.socket.id).roomid).find(el => el.id != res.socket.id);

    if (opponent == undefined)
        return;

    newData.subject = connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(res.socket.id).roomid).find(el => el.id == res.socket.id).username;

    if (req.damage != undefined)
        connectedUsersInfo.addDamage(opponent.id, req.damage);

    res.ioSend(res.io, opponent.id, "skill", req);
    res.ioSend(res.io, res.socket.id, "skill", req);
};

exports.update = (req, res) => {
    connectedUsersInfo.updateUserInfoBySocketId(req.horseBonesPositions, req.imageCode, req.direction, res.socket.id);
};

exports.fastUpdate = (req, res) => {
    connectedUsersInfo.updateUserPositionBySocketId(req.x, req.y, res.socket.id);
    connectedUsersInfo.updateUserActionBySocketId(req.actStatus, req.actTime, res.socket.id);
};

exports.sendGameover = res => {
    for (var el of connectedUsersInfo.getGameoverRooms()) {
        res.ioSend(res.io, el.users[0].id, "gameover", el);
        res.ioSend(res.io, el.users[1].id, "gameover", el);
    }
};

exports.sendUserData = res => {
    for (var user of connectedUsersInfo.userList) {
        res.ioSend(res.io,  user.id, "update_player", {users: connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(user.id).roomid)});
        res.ioSend(res.io,  user.id, "update_roomInfo", {room: connectedUsersInfo.getRoomByRoomid(connectedUsersInfo.getUserBySocketId(user.id).roomid)});
    }
};