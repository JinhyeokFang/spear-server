const connectionController = require("./controller/connectionController");
const accountController = require("./controller/accountController");
const inGameController = require("./controller/inGameController");
const {connect, sendMessageByIO, sendMessageBySocket, receiveMessageBySocket} = require("./modules/socket");

function receiveMessage (io, socket) {
    receiveMessageBySocket(socket, "disconnect",           requestData => connectionController.disconnect( requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));

    receiveMessageBySocket(socket, "login",                requestData => accountController.login(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "register",             requestData => accountController.register(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "setSkill",             requestData => accountController.setSkill(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "getSkill",             requestData => accountController.getSkill(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "sendFriendRequest",    requestData => accountController.sendFriendRequest(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "getFriendRequestList", requestData => accountController.getFriendRequestList(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "acceptFriendRequest",  requestData => accountController.acceptFriendRequest(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "getFriendsList",       requestData => accountController.getFriendsList(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "setRate",              requestData => accountController.setRate(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));

    receiveMessageBySocket(socket, "enter",                requestData => inGameController.enter(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "enterCancel",          requestData => inGameController.enterCancel(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "quit",                 requestData => inGameController.quit(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "skill",                requestData => inGameController.skill(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "playerUpdate",         requestData => inGameController.update(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
    receiveMessageBySocket(socket, "playerFastUpdate",     requestData => inGameController.fastUpdate(requestData, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket}));
}

function sendDataMessage (io, time) {
    setInterval(() => {
        inGameController.sendUserData({io, ioSend: sendMessageByIO});
        inGameController.sendGameover({io, ioSend: sendMessageByIO});
    }, time);
}

module.exports = io => {
    connect(io, socket => {
        connectionController.connect({}, {io, ioSend: sendMessageByIO, socket, socketSend: sendMessageBySocket});
        receiveMessage(io, socket);
        sendDataMessage(io, 20);
    });
};