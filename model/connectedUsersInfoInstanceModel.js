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
            getUserBySocketId(id) {
                let user = _connectedUserList.find(e => e.id == id);
                if (user != null)                
                    return user;
                else
                    return { err: "userNotFound" };    
            },
            loginUserBySocketId(id, username) {
                console.log(id, username)
                _updateUserBySocketId(id, { id, username });
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
                newData.horseBonesPositions = [];
                _updateUserBySocketId(id, newData);
                return { roomid: newData.roomid, err: null };
            },
            quitGameRoomBySocketId(id) {
                let newData = this.getUserBySocketId(id);
                newData.roomid = undefined;
                _updateUserBySocketId(id, newData);
            },
            moveUserPositionBySocketId(x, y, id) {
                let newData = this.getUserBySocketId(id);
                newData.x = x;
                newData.y = y;
                _updateUserBySocketId(id, newData);
            },
            getRoomByRoomid(roomid) {
                if (_roomList.length <= roomid) 
                    return null;

                let roomInfo = _roomList[roomid]; 
                roomInfo.users = _getUsersByRoomid(roomid);
                return roomInfo;
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
        if (_getUsersByRoomid(_roomList.length - 1) == 1 || _roomList.length == 0) {
            _createRoom();
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

    // function _removeRoomByPopMethod() {
    //     if (_roomList.length > 0)
    //         _roomList.pop();
    // }

    // function _updateRoom(roomid, update) {
    //     if (_roomList.length > roomid)
    //         _roomList[roomid] = update;
    // }

    return {
        getInstance() {
            if (!instance)
                instance = init();
            return instance;
        }
    };
})();