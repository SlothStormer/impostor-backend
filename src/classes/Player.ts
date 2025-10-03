export class Player {
    public username: string;
    public id: string;
    public online: boolean;

    constructor(username: string, id: string, online: boolean = true) {
        this.username = username;
        this.id = id;
        this.online = online;

        console.log(`Jugador añadido: ${this.username} (${this.id})`);
    }

    public isOnline(): boolean {
        return this.online;
    }

    public connect(): void {
        this.online = true;
    }

    public disconnect(): void {
        this.online = false;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public toJSON(): { username: string; id: string; online: boolean } {
        return {
            username: this.username,
            id: this.id,
            online: this.online,
        };
    }
}