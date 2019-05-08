module.exports = (function() {
    var instance = null
    var _connectedUserList = []
    
    function init() {
        return {
            getUserList() {
                return _connectedUserList
            },
            createUser(id) {
                _connectedUserList.push({id})
            },
            removeUserBySocketId(id) {
                let index = _connectedUserList.findIndex(e => e.id == id)
                if (index != -1)
                    _connectedUserList.splice(index, 1)
                else
                    return { err: "userNotFound" }    
            },
            updateUserBySocketId(id, update) {
                let index = _connectedUserList.findIndex(e => e.id == id)
                if (index != -1)                
                    _connectedUserList[index] = update
                else
                    return { err: "userNotFound" }    
            },
            getUserBySocketId(id, update) {
                let user = _connectedUserList.find(e => e.id == id)
                if (user != null)                
                    return user
                else
                    return { err: "userNotFound" }    
            },
            loginUserBySocketId(id, username) {
                this.updateUserBySocketId(id, { id, username })
            },
            enterGameRoomBySocketId(id, roomid) {
                let newData = this.getUserBySocketId(id)
                if (newData.username == undefined)
                    return { err: "can't enter game room without login" }
                newData.roomid = roomid
                this.updateUserBySocketId(id, newData)
                return {}
            },
            quitGameRoomBySocketId(id) {
                let newData = this.getUserBySocketId(id)
                newData.roomid = undefined
                this.updateUserBySocketId(id, newData)
            }
        }
    }

    return {
        getInstance() {
            if (!instance)
                instance = init()
            return instance
        }
    }
})()