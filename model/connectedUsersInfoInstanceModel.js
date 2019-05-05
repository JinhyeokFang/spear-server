module.exports = (function() {
    var instance = null
    var _connectedUserList = []
    
    function init() {
        return {
            getUserList() {
                return _connectedUserList
            },
            createUser(userInfo) {
                if (typeof userInfo == "object")
                    _connectedUserList.push(userInfo)
                else
                    return { err: "given userInfo is not object" }
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