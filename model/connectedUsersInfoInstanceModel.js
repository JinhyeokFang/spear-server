module.exports = (function() {
    var instance = null;
    var _connectedUserList = [];
    var _roomList = [];
    
    function _init() {
        setInterval(() => _removeRoomAutoByPopMethod(), 1000);
        //setInterval(() => console.log(_roomList), 1000);
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
            removeUserBySocketId(id, callback) {
                let index = _connectedUserList.findIndex(e => e.id == id);

                if (index != -1) {
                    if (_connectedUserList[index].roomid != undefined) {
                        if (this.getRoomByRoomid(_connectedUserList[index].roomid).inGame) {
                            callback(this.getUsersByRoomid(_connectedUserList[index].roomid).find(element => element.id != id));
                        } else {
                            this.enterCancelBySocketId(id);
                        }
                    }
                    _connectedUserList.splice(index, 1);
                } else {
                    return { err: "userNotFound" };
                }
            },
            getUserBySocketId(id) {
                let user = _connectedUserList.find(e => e.id == id);
                if (user != null)                
                    return user;
                else
                    return { err: "userNotFound" };    
            },
            loginUserBySocketId(id, username, nickname) {
                if (_connectedUserList.find(element => element.id == id) != undefined)
                    _updateUserBySocketId(id, { id, username, nickname });
                else if (_connectedUserList.find(element => element.username == username) == undefined)
                    return { err: "the user already logined" };
                else
                    return { err: "the user already logined" };
            },
            enterGameRoomBySocketId(id) {
                let newData = this.getUserBySocketId(id);
                if (newData.username == undefined)
                    return { err: "can't enter game room without login" };
                newData.roomid = _addUserIntoRoom();
                newData.x = 0;
                newData.y = 0;
                newData.direction = 0;
                newData.health = 0;
                newData.aniStatus = 0;
                newData.act = 0;
                newData.horseBonesPositions = [];
                _updateUserBySocketId(id, newData);
                return { roomid: newData.roomid, err: null };
            },
            enterCancelBySocketId(id) {
                let user = this.getUserBySocketId(id);
                if (user.roomid == undefined)
                    return { err: "the user didn't enter" };
                
                if (!this.getRoomByRoomid(user.roomid).inGame) {
                    _roomList[user.roomid].using = false;
                } else {
                    return { err: "the game didn't start" };
                }

                return { err: null };
            },
            quitGameRoomBySocketId(id) {
                let newData = this.getUserBySocketId(id);
                newData.roomid = undefined;
                _updateUserBySocketId(id, newData);
            },
            updateUserInfoBySocketId(x, y, act, id) {
                let newData = this.getUserBySocketId(id);
                newData.x = x;
                newData.y = y;
                newData.act = act;
                _updateUserBySocketId(id, newData);
            },
            getRoomByRoomid(roomid) {
                if (_roomList.length <= roomid) 
                    return null;

                let roomInfo = _roomList[roomid]; 
                roomInfo.users = _getUsersByRoomid(roomid);
                return roomInfo;
            },
            stopGameByRoomid(roomid) {
                if (roomid >= _roomList.length || roomid === undefined)
                    return;
                let newData = this.getRoomByRoomid(roomid);
                newData.inGame = false;
                newData.using = false;
                _updateRoomByRoomid(roomid, newData);
            },
            getOpponentUserBySocketId(id) {
                if (this.getUserBySocketId(id).roomid == undefined)
                    return null;
                if (_getUsersByRoomid(this.getUserBySocketId(id).roomid).length != 2)
                    return null;
        
                return _getUsersByRoomid(this.getUserBySocketId(id).roomid).find(element => element.id != id);
            },
            getRoomBySocketId(id) {
		if (this.getUserBySocketId(id) == undefined)
		return null;
                if (this.getUserBySocketId(id).roomid == undefined)
                    return null;
            
                return this.getRoomByRoomid(this.getUserBySocketId(id).roomid);
            }
        };
    }

    function _updateUserBySocketId(id, update) {
        let index = _connectedUserList.findIndex(e => e.id == id);
        if (index != -1)                
            _connectedUserList[index] = update;
        else
            return { err: "userNotFound" };    
    }

    function _addUserIntoRoom() {
        if (_roomList.length == 0) {
            _createRoom();
            return 0;
        }
        if (_getUsersByRoomid(_roomList.length - 1).length == 1) {
            _startGame(_roomList.length - 1);
            _createRoom();
            return _roomList.length - 2;
        }
        return _roomList.length - 1;
    }

    function _getUsersByRoomid(roomid) {
        if (_roomList.length > roomid)
            return _connectedUserList.filter(element => element.roomid == roomid);
    }

    function _createRoom() {
        _roomList.push({
            inGame: false,
            using: true,
            score: [],
            time: 300
        });
    }

    function _removeRoomAutoByPopMethod() {
        if (_roomList.length > 0 && !_roomList[_roomList.length - 1].using)
            _roomList.pop();
    }

    function _updateRoomByRoomid(roomid, update) {
        if (_roomList.length > roomid)
            _roomList[roomid] = update;
    }

    function _startGame(roomid) {
        if (roomid >= _roomList.length)
            return;
        if (!_roomList[roomid].using && _roomList[roomid].inGame)
            return;
        _roomList[roomid].inGame = true;
    }

    return {
        getInstance() {
            if (!instance)
                instance = _init();
            return instance;
        }
    };
})();
