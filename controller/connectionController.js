const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.connect = (req, res) => {
    connectedUsersInfo.createUser(res.socket.id);
};

exports.disconnect = (req, res) => {
    connectedUsersInfo.removeUserBySocketId(res.socket.id, opponentUser => {
        if(opponentUser != undefined)
            res.ioSend(res.io, opponentUser.id, "gameover", {result: "the opponent user quit", winner: res.socket.id});
    });
};