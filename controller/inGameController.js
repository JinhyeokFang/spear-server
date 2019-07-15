const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();
const db = require("../db");

exports.enter = (req, res) => {
    let result = connectedUsersInfo.enterGameRoomBySocketId(res.socket.id, req.isRank);
    let users = connectedUsersInfo.getUsersByRoomid(result.roomid);

	if (users == undefined) {
	res.socketSend(res.socket, "enterCallback", { message: "enter failed", err: "something went wrong", roomid: result.roomid });
	return;
}	

    if (result.err != null) {
        res.socketSend(res.socket, "enterCallback", { message: "enter failed", err: result.err});
    } else {
        if (users.length >= 2) {
            db.getRate({username: users[0].username}, resu => {
                db.getRate({username: users[1].username}, resul => {
		console.log(resu, resul);
                    res.socketSend(res.socket, "enterCallback", { message: "enter complete", roomid: result.roomid, users, rate: {one: resu.rate, two: resul.rate}, startGame: true});
                });
            });
        } else {
            res.socketSend(res.socket, "enterCallback", { message: "enter complete", roomid: result.roomid, users, startGame: false});
        }
    }

    if(users.length >= 2) {
        db.getRate({username: users[0].username}, resu => {
            db.getRate({username: users[1].username}, resul => {
                users.forEach(user => res.ioSend(res.io, user.id, "gamestart", {rate: {one: resu.rate, two: resul.rate}}));
            });
        });
    }
};

exports.enterCustom = (req, res) => {
    let result = connectedUsersInfo.enterCustomGameRoom(res.socket.id, res.roomid, res.password);
    let users = connectedUsersInfo.getUsersByRoomid(res.roomid);

    if (result.err != null) {
        res.socketSend(res.socket, "enterCustomCallback", { message: "enter failed", err: result.err});
    } else {
        if (users.length >= 2)
            res.socketSend(res.socket, "enterCustomCallback", { message: "enter complete", roomid: result.roomid, users, startGame: true});
        else
            res.socketSend(res.socket, "enterCustomCallback", { message: "enter complete", roomid: result.roomid, users, startGame: false});
    }

    if(users.length >= 2) {
        users.forEach(user => res.ioSend(res.io, user.id, "gamestart"));
    }
};

exports.enterNewCustom = (req, res) => {
    let result = connectedUsersInfo.enterNewCustomGameRoom(res.socket.id, res.password);
    let users = connectedUsersInfo.getUsersByRoomid(result.roomid);

    if (result.err != null) {
        res.socketSend(res.socket, "enterNewCustomCallback", { message: "enter failed", err: result.err});
    } else {
        if (users.length >= 2)
            res.socketSend(res.socket, "enterNewCustomCallback", { message: "enter complete", roomid: result.roomid, users, startGame: true});
        else
            res.socketSend(res.socket, "enterNewCustomCallback", { message: "enter complete", roomid: result.roomid, users, startGame: false});
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
    connectedUsersInfo.updateUserInfoBySocketId(req.object, req.player_image, req.player_direction, res.socket.id);
};

exports.fastUpdate = (req, res) => {
    connectedUsersInfo.updateUserPositionBySocketId(req.player_pos.x, req.player_pos.y, res.socket.id);
    connectedUsersInfo.updateUserActionBySocketId(req.player_action, req.player_action_time, res.socket.id);
};

exports.sendGameover = res => {
    for (var el of connectedUsersInfo.getGameoverRooms()) {
        if (el.winner != null) {
            if (el.winner.username == el.users[0].username) {
                db.getRate({username: el.users[0].username}, result => {
                    let temp = 1;
                    temp = result.rate >= 15 ? 15 : result.rate + 1;
			db.setRate({username: el.users[0].username, rate: temp}, (err, result) => {});
                    res.ioSend(res.io, el.users[0].id, "gameover", el);
                });
                db.getRate({username: el.users[1].username}, result => {
                    let temp = 1;
                    temp = result.rate <= 1 ? 1 : result.rate - 1;
			db.setRate({username: el.users[1].username, rate: temp}, (err, result) => {});
                    res.ioSend(res.io, el.users[1].id, "gameover", el);
                });
            } else {
                db.getRate({username: el.users[0].username}, result => {
                    let temp = 1;
			temp = result.rate <= 1 ? 1 : result.rate - 1;
			db.setRate({username: el.users[0].username, rate: temp}, (err, result) => {});
                    res.ioSend(res.io, el.users[0].id, "gameover", el);
		});
                db.getRate({username: el.users[1].username}, result => {
                    let temp = 1;
			temp = result.rate >= 15 ? 15 : result.rate + 1;
			db.setRate({username: el.users[1].username, rate: temp}, (err, result) => {});
                    res.ioSend(res.io, el.users[1].id, "gameover", el);
		    });
            }
        }
    }
};

exports.sendUserData = res => {
    for (var user of connectedUsersInfo.userList) {
        res.ioSend(res.io,  user.id, "update_player", {users: connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(user.id).roomid)});
        res.ioSend(res.io,  user.id, "update_roomInfo", {room: connectedUsersInfo.getRoomByRoomid(connectedUsersInfo.getUserBySocketId(user.id).roomid)});
    }
};
