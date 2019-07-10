module.exports = (function() {
    var instance = null;
    var _connectedUserList = [];
    var _roomList = [];
    
    function _init() {
        setInterval(() => _removeRoomAutoByPopMethod(), 1000);
//	setInterval(() => console.log(_connectedUserList, _roomList), 1000);
        return {
            createUser(id) {
                _connectedUserList.push({id});
            },
            removeUserBySocketId(id, callback) {
                let index = _connectedUserList.findIndex(e => e.id == id);

                if (index != -1) {
                    if (_connectedUserList[index].roomid != undefined) {
                        if (this.getRoomByRoomid(_connectedUserList[index].roomid) == undefined) {
                            this.enterCancelBySocketId(id);
                            return;
                        }
                        if (this.getRoomByRoomid(_connectedUserList[index].roomid).inGame) {
                            this.stopGameByRoomid(_connectedUserList[index].roomid);
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
            updateUserInfoBySocketId(horseBonesPositions, imageCode, direction, id) {
                let newData = this.getUserBySocketId(id);
                newData.object = horseBonesPositions;
                newData.player_image = imageCode;
                newData.player_direction = direction;
                _updateUserBySocketId(id, newData);
            },
            updateUserPositionBySocketId(x, y, id) {
                let newData = this.getUserBySocketId(id);
                newData.player_pos = {x,y};
                _updateUserBySocketId(id, newData);
            },
            updateUserActionBySocketId(actStatus, actTime, id) {
                let newData = this.getUserBySocketId(id);
                newData.player_action = actStatus;
                newData.player_action_time = actTime;
                _updateUserBySocketId(id, newData);
            },
            loginUserBySocketId(id, username, nickname) {
                if (_connectedUserList.find(element => element.id == id) != undefined && _connectedUserList.find(element => element.username == username) == undefined)
                    _updateUserBySocketId(id, { id, username, nickname });
                else
                    return { err: "the user already logined" };
            },
            enterGameRoomBySocketId(id) {
                let newData = this.getUserBySocketId(id);
                if (newData.username == undefined)
                    return { err: "can't enter game room without login" };
                newData.roomid = _addUserIntoRoom();
                newData.player_pos = {
                    x: 0,
                    y: 0
                };
                newData.object = {
                    horse_head: {
                        x: 0, y: 0, angle: 0
                    },
                    horse_neck: {
                        x: 0, y: 0, angle: 0
                    },
                    horse_body: {
                        x: 0, y: 0, angle: 0
                    },
                    horse_leg_right_front_top: {
                        x: 0, y: 0, angle: 0
                    },
                    horse_leg_right_back_bottom: {
                        x: 0, y: 0, angle: 0
                    },
                    horse_leg_left_front_top: {
                        x: 0, y: 0, angle: 0
                    },
                    horse_leg_left_front_bottom: {
                        x: 0, y: 0, angle: 0
                    },
                    horse_leg_left_back_top: {
                        x: 0, y: 0, angle: 0
                    },
                    horse_leg_left_back_bottom: {
                        x: 0, y: 0, angle: 0
                    },
                    knight: {
                        x: 0, y: 0, angle: 0
                    }
                };
                newData.player_health = 100;
                newData.player_image = 0;
                newData.player_action = 0;
                newData.player_action_time = 0;
                newData.player_direction = true;
                _updateUserBySocketId(id, newData);
                return { roomid: newData.roomid, err: null };
            },
            enterNewCustomGameRoom(id, password) {
                let roomid = _createRoom(true, password);
                let newData = this.getUserBySocketId(id);
                if (newData.username == undefined)
                    return { err: "can't enter game room without login" };
                newData.roomid = roomid;
                newData.player_pos = {
                    x: 0,
                    y: 0
                };
		newData.object = {};
                newData.player_health = 100;
                newData.player_image = 0;
                newData.player_action = 0;
                newData.player_action_time = null;
                newData.player_direction = [];
                _updateUserBySocketId(id, newData);
                return { roomid, err: null };
            },
            enterCustomGameRoom(id, roomid, password) {
                if (roomid < _roomList.length - 1 || _roomList[roomid].inGame || !_roomList[roomid].custom) 
                    return { err: "room not found" };
                if (_roomList[roomid].password == password)
                    return { err: "password is wrong" };

                let newData = this.getUserBySocketId(id);
                if (newData.username == undefined)
                    return { err: "can't enter game room without login" };
                newData.roomid = roomid;
                newData.player_pos = {
                    x: 0,
                    y: 0
                };
		newData.object = {};
                newData.player_health = 100;
                newData.player_image = 0;
                newData.player_action = 0;
                newData.player_action_time = null;
                newData.player_direction = [];
                _updateUserBySocketId(id, newData);
                return { roomid, err: null };
            },
            enterCancelBySocketId(id) {
                let user = this.getUserBySocketId(id);
                if (user.roomid == undefined)
                    return { err: "the user didn't enter" };
                if (_roomList[user.roomid] == undefined)
		    return { err: "room not found"};
                _roomList[user.roomid].using = false;

                return { err: null };
            },
            quitGameRoomBySocketId(id) {
                let newData = this.getUserBySocketId(id);
                newData.roomid = undefined;
                _updateUserBySocketId(id, newData);
            },
            stopGameByRoomid(roomid) {
                if (roomid >= _roomList.length || roomid === undefined)
                    return;
                let newData = this.getRoomByRoomid(roomid);
                newData.inGame = false;
                newData.using = false;
                _updateRoomByRoomid(roomid, newData);
            },
            addDamage(id, damage) {
                let newData = this.getUserBySocketId(id);
                newData.player_health -= damage;
                if (newData.player_health < 0)
                    newData.player_health = 0;
                _updateUserBySocketId(id, newData);
            },
            getUserBySocketId(id) {
                let user = _connectedUserList.find(e => e.id == id);
                if (user != null)                
                    return user;
                else
                    return { err: "userNotFound" };  
            },
            getRoomByRoomid(roomid) {
                if (_roomList.length <= roomid) 
                    return null;

                let roomInfo = _roomList[roomid]; 
                if (roomInfo == undefined)
                    return;

                roomInfo.users = _getUsersByRoomid(roomid);
                return roomInfo;
            },
            getOpponentUserBySocketId(id) {
                if (this.getUserBySocketId(id).roomid == undefined)
                    return null;
                if (_getUsersByRoomid(this.getUserBySocketId(id).roomid))
                    return null;
                if (_getUsersByRoomid(this.getUserBySocketId(id).roomid).length != 2)
                    return null;
                return _getUsersByRoomid(this.getUserBySocketId(id).roomid).find(element => element.id != id);
            },
            getUsersByRoomid(roomid) {
                if (_roomList.length > roomid)
                    return _connectedUserList.filter(element => element.roomid == roomid);
                
            },
            getGameoverRooms() {
                let newData = [];
                _roomList.filter(el => el.inGame).forEach(el => {
                    let users = this.getUsersByRoomid(el.roomid);
                    if (users == undefined)
                        return;
                    if (users.length < 2)
                        return;
                    if (users[0].player_health == undefined)
                        return;
                    if (users[0].player_health <= 0 && users[1].player_health <= 0) {
                        newData.push({
                            winner: null,
                            result: "draw",
                            room: el,
                            users
                        });
                    } else if (users[0].player_health <= 0) {
                        newData.push({
                            winner: users[1],
                            result: users[1].username + " win",
                            room: el,
                            users
                        });
                    } else if (users[1].player_health <= 0) {
                        newData.push({
                            winner: users[0],
                            result: users[0].username + " win",
                            room: el,
                            users
                        });
                    } else {
                        return;
                    }
                    this.stopGameByRoomid(el.roomid);
                });

                return newData;
            },
            get userList() {
                return _connectedUserList;
            },
            get roomList() {
                return _roomList;
            }
        };
    }

    function _createRoom(custom, password) {
        _roomList.push({
            inGame: false,
            using: true,
            custom,
            score: [],
            time: 300,
            password,
            roomid: _roomList.length
        });

        return _roomList.length - 1;
    }

    function _removeRoomAutoByPopMethod() {
     //   if (_roomList.length > 0 && _roomList[_roomList.length - 1].using == false && _roomList[_roomList.length - 1].inGame == false)
       //     _roomList.pop();
    }

    function _updateUserBySocketId(id, update) {
        let index = _connectedUserList.findIndex(e => e.id == id);
        if (index != -1)                
            _connectedUserList[index] = update;
        else
            return { err: "userNotFound" };    
    }

    function _addUserIntoRoom() {
        let roomIndex = _getAvailableRoom();
        if (_getAvailableRoom() == -1) {
            return _createRoom(false);
        }
        if (_getUsersByRoomid(roomIndex).length == 1) {
            _startGame(roomIndex);
        }
        return roomIndex;
    }

    function _getAvailableRoom () {
        return _roomList.findIndex(room => room.custom == false && room.inGame == false && room.using == true);
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

    function _getUsersByRoomid(roomid) {
        if (_roomList.length > roomid)
            return _connectedUserList.filter(element => element.roomid == roomid);
    }

    return {
        getInstance() {
            if (!instance)
                instance = _init();
            return instance;
        }
    };
})();
