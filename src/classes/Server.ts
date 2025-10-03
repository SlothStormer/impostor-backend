import type { Player } from "./Player.js";

type Stage = "BOOKING" | "PREROUND" | "ROUND" | "FINISH";
const STAGES = ["BOOKING", "PREROUND", "ROUND", "FINISH"];

interface Item {
  username: string;
  hint: string;
  item: string;
}

interface GameState {
  stage: Stage;
  doubleImpostor: boolean;
  items: Item[];
  roundHost: Player | null;
  hostItem: Item;
  impostor: string;
}

export class GameServer {
  private _players: Player[];
  private _alreadyPlayed: Item[];
  private _gameState: GameState;

  constructor() {
    this._players = [];
    this._alreadyPlayed = [];
    this._gameState = {
      stage: "BOOKING",
      doubleImpostor: false,
      items: [],
      roundHost: null,
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

  public addPlayer(player: Player): void {
    this._players.push(player);
  }

  public getPlayerById(id: string): Player | undefined {
    return this._players.find((p) => p.id === id);
  }

  public desconnectPlayer(id: string): void {
    const player = this._players.find((p) => p.id === id);
    if (!player) return;

    player.online = false;
    return;
  }

  public removePlayer(id: string): void {
    this._players = this._players.filter((p) => p.id !== id);
  }

  public setStage(stage: Stage): void {
    this._gameState.stage = stage;
  }

  public nextStage(): void {
    const currentIndex = STAGES.indexOf(this._gameState.stage);
    const nextIndex = (currentIndex + 1) % STAGES.length; 
    this._gameState.stage = STAGES[nextIndex === 0 ? 1 : nextIndex] as Stage;
  }

  public setImpostorMode(mode: boolean): void {
    this._gameState.doubleImpostor = mode;
  }

  public setRoundHost(player: Player): void {
    this._gameState.roundHost = player;
  }

  public setImpostor(username: string): void {
    this._gameState.impostor = username;
  }

  public addItem(item: Item): void {
    this._gameState.items.push(item);
  }

  public markItemAsPlayed(item: Item): void {
    this._alreadyPlayed.push(item);
    this._gameState.items = [];
  }

  public resetPlayedItems(): void {
    this._alreadyPlayed = [];
  }
}
