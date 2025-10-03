export class GameServer {
  private _players: Player[];
  private _alreadyPlayed: Item[];
  private _gameState: GameState;

  constructor() {
    this._players = [];
    this._alreadyPlayed = [];
    this._gameState = {
      stage: "BOOKING",
      mode: "WITH_HOST",
      items: [],
      roundHost: {
        username: "",
        id: "",
        isOnline: false,
      },
      hostItem: { username: "", hint: "", item: "" },
      impostor: "",
    };
  }

  public getState(): {
    players: Player[];
    alreadyPlayed: Item[];
    gameState: GameState;
  } {
    return {
      players: this._players,
      alreadyPlayed: this._alreadyPlayed,
      gameState: this._gameState,
    };
  }
}
