module.exports = (function() {
    var instance = null;
    var _connectedUserList = [];
    var _roomList = [];
    
    function init() {
        return {
            get userList() {
                return _connectedUserList;
            },
            get roomList() {
                return _roomList;
            },
            createUser(id) {
                _connectedUserList.push({id});
            },
            removeUserBySocketId(id) {
                let index = _connectedUserList.findIndex(e => e.id == id);
                if (index != -1)
                    _connectedUserList.splice(index, 1);
                else
                    return { err: "userNotFound" };    
            },
            updateUserBySocketId(id, update) {
                let index = _connectedUserList.findIndex(e => e.id == id);
                if (index != -1)                
                    _connectedUserList[index] = update;
                else
                    return { err: "userNotFound" };    
            },
            getUserBySocketId(id) {
                let user = _connectedUserList.find(e => e.id == id);
                if (user != null)                
                    return user;
                else
                    return { err: "userNotFound" };    
            },
            loginUserBySocketId(id, username) {
                this.updateUserBySocketId(id, { id, username });
            },
            enterGameRoomBySocketId(id, roomid) {
                let newData = this.getUserBySocketId(id);
                if (newData.username == undefined)
                    return { err: "can't enter game room without login" };
                newData.roomid = roomid;
                newData.x = 0;
                newData.y = 0;
                newData.direction = 0;
                newData.health = 0;
                this.updateUserBySocketId(id, newData);
                return { err: null };
            },
            quitGameRoomBySocketId(id) {
                let newData = this.getUserBySocketId(id);
                newData.roomid = undefined;
                this.updateUserBySocketId(id, newData);
            },
            moveUserPositionBySocketId(x, y, id) {
                let newData = this.getUserBySocketId(id);
                newData.x = x;
                newData.y = y;
                this.updateUserBySocketId(id, newData);
            },
            createRoom() {
                _roomList.push({
                    
                });
                return _roomList.length;
            },
            removeRoomByPop() {
                if (_roomList.length > 0)
                    _roomList.pop();
            },
            updateRoom(roomid, update) {
                if (_roomList.length > roomid)
                    _roomList[roomid] = update;
            },
            getRoom(roomid) {
                if (_roomList.length > roomid)
                    return _roomList[roomid];
            }
        };
    }

    return {
        getInstance() {
            if (!instance)
                instance = init();
            return instance;
        }
    };
})();