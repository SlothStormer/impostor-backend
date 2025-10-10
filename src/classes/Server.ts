import { AllImpostors } from "../modes/AllImpostors.js";
import { ClassicMode } from "../modes/ClassicMode.js";
import { DoubleImpostor } from "../modes/DoubleImpostor.js";
import type { GameMode } from "../modes/GameMode.js";
import { NoImpostor } from "../modes/NoImpostor.js";
import type { Player } from "./Player.js";

type Stage = "BOOKING" | "PREROUND" | "ROUND" | "FINISH";
const STAGES = ["BOOKING", "PREROUND", "ROUND", "FINISH"];

export class GameServer {
  private _players: Player[];
  private _alreadyPlayed: Item[];
  private _gameState: GameState;
  public mode: GameMode;

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
    this.mode = new ClassicMode
  }

  public getState(): {
    players: Player[];
    alreadyPlayed: Item[];
    gameState: GameState;
    mode: GameMode
  } {
    return {
      players: this._players,
      alreadyPlayed: this._alreadyPlayed,
      gameState: this._gameState,
      mode: this.mode
    };
  }

  public getCurrentItemsAmount(): number {
    return this._gameState.items.length;
  }

  public getPlayersAmount(filterEliminated: boolean = false): number {
    if (filterEliminated) {
      return this._players.filter((p) => !p.isEliminated).length;
    }
    return this._players.length;
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

  public disconnectPlayer(id: string): void {
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

    switch (this._gameState.stage) {
      case "BOOKING":
        this.toBooking();
        break;
      case "PREROUND":
        this.toPreRound();
        break;
      case "ROUND":
        this.toRound();
        break;
      case "FINISH":
        this.toFinish();
        break;
    }
  }

  public toBooking(): void {}

  public toPreRound(): void {
    this.resetImpostor();
    this.resetHostItem();
    this.resetElimitedPlayers();
  }

  public toRound(): void {
    const value = Math.random()
    console.log("Value", value)
    if (value <= 0.1) {
      const modeValue = Math.random()
      this.setGameMode(modeValue < 0.5 ? new NoImpostor() : new AllImpostors());
    } else {
      this.setGameMode(this._gameState.doubleImpostor ? new DoubleImpostor() : new ClassicMode());
    }
    this.mode.startRound(this);
  }

  public toFinish(): void {
    this.resetVotes();
    this.resetItems();

    this._alreadyPlayed.push(this._gameState.hostItem);
    this._gameState.roundHost =
      this._players[
        this._players.findIndex((p) => p === this._gameState.roundHost) + 1
      ]! || this._players[0];
  }

  public nextTurn(): void {
    this.resetVotes();

    const currentPlayer = this._players.find(
      (p) => p === this._gameState.playerTurn
    );
    if (!currentPlayer) return;

    const currentIndex = this._players.indexOf(currentPlayer);
    let nextIndex =
      currentIndex === this._players.length - 1 ? 0 : currentIndex + 1;

    while (this._players[nextIndex]!.isEliminated) {
      nextIndex = nextIndex === this._players.length - 1 ? 0 : nextIndex + 1;
    }

    this._gameState.playerTurn = this._players[nextIndex];
  }

  public setImpostorMode(mode: boolean): void {
    this._gameState.doubleImpostor = mode;
    this.mode = mode ? new DoubleImpostor() : new ClassicMode()
  }

  public isDobleImpostor(): boolean {
    return this._gameState.doubleImpostor;
  }

  public getPlayers(): Player[] {
    return this._players;
  }

  public getItems(): Item[] {
    return this._gameState.items;
  }

  public setGameMode(mode: GameMode): void {
    this.mode = mode;
  }

  public setHostItem(newItem : Item): void {
    this._gameState.hostItem = newItem;
  }

  public setPlayerTurn(onlinePlayers: Player[]): void {
    this._gameState.playerTurn = this._gameState.roundHost || onlinePlayers[0];
  }

  public setRoundHost(player: Player): void {
    this._gameState.roundHost = player;
  }

  public setImpostor(username: string): void {
    this._gameState.impostor = username;
  }

  public setImpostors(usernames: string[]): void {
    this._gameState.impostor = usernames;
  }

  public getImpostor(): string {
    return this._gameState.impostor as string;
  }

  public getImpostors(): string[] {
    return this._gameState.impostor as string[];
  }

  public resetImpostor(): void {
    this._gameState.impostor = "";
  }

  public resetElimitedPlayers(): void {
    const eliminatedPlayers = this._players.filter((p) => p.isEliminated);
    eliminatedPlayers.forEach((p) => p.setIsEliminated(false));
  }

  public addItem(item: Item): void {
    this._gameState.items.push(item);
  }

  public resetItems(): void {
    this._gameState.items = [];
  }

  public addVote(from: Player, to: Player): void {
    const alreadyVoted = this._gameState.votes.find((v) => v.from === from);
    if (alreadyVoted) return;

    this._gameState.votes.push({ from, to });
  }

  public getAllVotes(): Vote[] {
    return this._gameState.votes;
  }

  public getVotesToPlayer(player: Player): Vote[] {
    return this._gameState.votes.filter((v) => v.to === player);
  }

  public resetVotes(): void {
    this._gameState.votes = [];
  }


  public resetHostItem(): void {
    this._gameState.hostItem = { username: "", hint: undefined, item: ""}
  }

  public markItemAsPlayed(item: Item): void {
    this._alreadyPlayed.push(item);
    this._gameState.items = [];
  }

  public resetPlayedItems(): void {
    this._alreadyPlayed = [];
  }
}
