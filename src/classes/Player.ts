export class Player {
  public username: string;
  public id: string;
  public socketId: string;
  public online: boolean;
  public isEliminated: boolean;

  constructor(username: string, id: string, socketId: string, online: boolean = true, isEliminated: boolean = false) {
    this.username = username;
    this.id = id;
    this.socketId = socketId;
    this.online = online;
    this.isEliminated = isEliminated;
  }

  public isOnline(): boolean {
    return this.online;
  }

  public connect(newSocketId: string | undefined): void {
    this.online = true;
    this.socketId = newSocketId ? newSocketId : this.socketId;
  }

  public disconnect(): void {
    this.online = false;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public setIsEliminated(isEliminated: boolean): void {
    this.isEliminated = isEliminated;
  }

  public toJSON() {
    return {
      username: this.username,
      id: this.id,
      socketId: this.socketId,
      online: this.online,
      isEliminated: this.isEliminated,
    };
  }
}
