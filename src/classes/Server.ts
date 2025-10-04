import type { Player } from "./Player.js";

type Stage = "BOOKING" | "PREROUND" | "ROUND" | "FINISH";
const STAGES = ["BOOKING", "PREROUND", "ROUND", "FINISH"];

interface Item {
  username: string;
  hint: string | undefined;
  item: string;
}

interface Vote {
  from: Player;
  to: Player;
}

interface GameState {
  stage: Stage;
  doubleImpostor: boolean;
  items: Item[];
  votes: Vote[];
  roundHost: Player | null;
  playerTurn: Player | undefined | null;
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
      votes: [],
      roundHost: null,
      playerTurn: null,
      hostItem: { username: "", hint: undefined, item: "" },
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

    if (this._players.length === 1) {
      this._gameState.playerTurn = player;
      this._gameState.roundHost = player;
    }
  }

  public getPlayerByUsername(username: string): Player | undefined {
    return this._players.find((p) => p.username === username);
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

    if (this._gameState.stage === "ROUND") {
      // Filtrar jugadores conectados
      const onlinePlayers = this._players.filter((p) => p.online);
      if (onlinePlayers.length < 2) return;

      // Seleccionar el impostor
      const impostor =
        onlinePlayers[Math.floor(Math.random() * onlinePlayers.length)];
      this.setImpostor(impostor!.username);

      // seleccionar el item
      const itemsFiltered = this._gameState.items.filter(
        (item) => item.username !== impostor!.username
      );
      if (itemsFiltered.length === 0) return;

      const item =
        itemsFiltered[Math.floor(Math.random() * itemsFiltered.length)];

      this._gameState.hostItem = item!;
    }

    if (this._gameState.stage === "FINISH") {
      this.resetVotes();
      this.resetItems();

      this._gameState.impostor = "";
      this._gameState.hostItem = { username: "", hint: undefined, item: "" };
      this._gameState.roundHost = this._players[this._players.findIndex((p) => p === this._gameState.roundHost) + 1]! || this._players[0];
    }
  }

  public nextTurn(): void {
    const currentPlayer = this._players.find(
      (p) => p === this._gameState.playerTurn
    );
    if (!currentPlayer) return;

    const currentIndex = this._players.indexOf(currentPlayer);
    const nextIndex =
      currentIndex === this._players.length - 1 ? 0 : currentIndex + 1;

    this._gameState.playerTurn = this._players[nextIndex];
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

  public resetItems(): void {
    this._gameState.items = [];
  }

  public addVote(from: Player, to: Player): void {
    this._gameState.votes.push({ from, to });
  }

  public resetVotes(): void {
    this._gameState.votes = [];
  }

  public markItemAsPlayed(item: Item): void {
    this._alreadyPlayed.push(item);
    this._gameState.items = [];
  }

  public resetPlayedItems(): void {
    this._alreadyPlayed = [];
  }
}
