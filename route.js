const connectionController = require("./controller/connectionController");
const authController = require("./controller/authController");
const inGameController = require("./controller/inGameController");
const {connect, sendMessageByIO, sendMessageBySocket, receiveMessageBySocket} = require("./modules/socket");

function receiveMessage (io, socket) {
    receiveMessageBySocket(socket, "disconnect", () => connectionController.disconnect(socket.id, opponentUser => {
        if(opponentUser != undefined)
            sendMessageByIO(io, opponentUser.id, "gameover", {result: "the opponent user quit", winner: socket.id});
    }));

    receiveMessageBySocket(socket, "login", data => authController.login(socket, data, res => {
        sendMessageBySocket(socket, "loginCallback", res);
    }));
    receiveMessageBySocket(socket, "register", data => authController.register(socket, data, res => {
        sendMessageBySocket(socket, "registerCallback", res);
    }));

    receiveMessageBySocket(socket, "enter", () => inGameController.enter(socket.id, (roomid, users, err) => {
        if(err != null) {
            sendMessageBySocket(socket, "enterCallback", { message: "enter failed", err});
        } else {
            if (users.length >= 2)
                sendMessageBySocket(socket, "enterCallback", { message: "enter complete", roomid, users, startGame: true});
            else
                sendMessageBySocket(socket, "enterCallback", { message: "enter complete", roomid, users, startGame: false});
        }

        if(users.length >= 2) {
            users.forEach(user => sendMessageByIO(io, user.id, "gamestart"));
        }
    })),
    receiveMessageBySocket(socket, "enterCancel", () => inGameController.enterCancel(socket.id, err => {
        if(err != null)
            sendMessageBySocket(socket, "enterCancelCallback", { message: "enterCancel failed", err});
        else
            sendMessageBySocket(socket, "enterCancelCallback", { message: "enterCancel complete"});
    }));
    receiveMessageBySocket(socket, "quit", () => inGameController.quit(socket.id));
    receiveMessageBySocket(socket, "skill", data => {
        let newData = data;
        if (inGameController.getUsers(socket.id) == undefined)
            return;
        let opponent = inGameController.getUsers(socket.id).find(el => el.id != socket.id);
        if (opponent == undefined)
            return;
        newData.subject = inGameController.getUsers(socket.id).find(el => el.id == socket.id).username;
        if (data.damage != undefined)
            inGameController.addDamage(opponent.id, data.damage);
        sendMessageByIO(io, opponent.id, "skill", data);
        sendMessageByIO(io, socket.id, "skill", data);
    });
    receiveMessageBySocket(socket, "playerUpdate", data => inGameController.update(socket.id, data.object, data.player_image, data.player_direction));
    receiveMessageBySocket(socket, "playerFastUpdate", data => {
        inGameController.updatePosition(socket.id, data.player_pos.x, data.player_pos.y);
        inGameController.updateAction(socket.id, data.player_action, data.player_action_time);
    });
    receiveMessageBySocket(socket, "setSkill", data => authController.setSkill(data));
    receiveMessageBySocket(socket, "getSkill", data => sendMessageBySocket(socket, "getSkillCallback", { skill1Array: authController.getSkill(data).skill1Array, skill2Array: authController.getSkill(data).skill2Array}));
}

function checkGameOver (io, time) {
    setInterval(() => {inGameController.getGameoverRoom().forEach(el => {
        sendMessageByIO(io, el.users[0].id, "gameover", el);
        sendMessageByIO(io, el.users[1].id, "gameover", el);
    });}, time);
}

function sendDataMessage (io, time) {
    setInterval(() => {
        for (var user of connectionController.getUsers()) {
            sendMessageByIO(io, user.id, "update_player", {users: inGameController.getUsers(user.id)});
            sendMessageByIO(io, user.id, "update_roomInfo", {room: inGameController.getRoom(user.id)});
        }
    }, time);
}

module.exports = io => {
    connect(io, socket => {
        connectionController.connect(socket.id);
        receiveMessage(io, socket);
    });
    sendDataMessage(io, 20);
    checkGameOver(io, 30);
};
