export class Player {
  public username: string;
  public id: string;
  public online: boolean;
  public isEliminated: boolean;

  constructor(username: string, id: string, online: boolean = true, isEliminated: boolean = false) {
    this.username = username;
    this.id = id;
    this.online = online;
    this.isEliminated = false;
  }

  public isOnline(): boolean {
    return this.online;
  }

  public connect(newId: string | undefined): void {
    this.online = true;
    this.id = newId ? newId : this.id;
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
      online: this.online,
    };
  }
}
