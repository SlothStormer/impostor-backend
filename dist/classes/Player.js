export class Player {
    username;
    id;
    online;
    constructor(username, id, online = true) {
        this.username = username;
        this.id = id;
        this.online = online;
        console.log(`Jugador añadido: ${this.username} (${this.id})`);
    }
    isOnline() {
        return this.online;
    }
    connect() {
        this.online = true;
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