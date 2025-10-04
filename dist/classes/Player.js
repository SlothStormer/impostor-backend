export class Player {
    username;
    id;
    online;
    constructor(username, id, online = true) {
        this.username = username;
        this.id = id;
        this.online = online;
    }
    isOnline() {
        return this.online;
    }
    connect(newId) {
        this.online = true;
        this.id = newId;
    }
    disconnect() {
        this.online = false;
    }
    setUsername(username) {
        this.username = username;
    }
    toJSON() {
        return {
            username: this.username,
            id: this.id,
            online: this.online,
        };
    }
}
//# sourceMappingURL=Player.js.map