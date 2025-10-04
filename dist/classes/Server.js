const STAGES = ["BOOKING", "PREROUND", "ROUND", "FINISH"];
export class GameServer {
    _players;
    _alreadyPlayed;
    _gameState;
    constructor() {
        this._players = [];
        this._alreadyPlayed = [];
        this._gameState = {
            stage: "BOOKING",
            doubleImpostor: false,
            items: [],
            roundHost: null,
            playerTurn: null,
            hostItem: { username: "", hint: "", item: "" },
            impostor: "",
        };
    }
    getState() {
        return {
            players: this._players,
            alreadyPlayed: this._alreadyPlayed,
            gameState: this._gameState,
        };
    }
    addPlayer(player) {
        this._players.push(player);
    }
    getPlayerByUsername(username) {
        return this._players.find((p) => p.username === username);
    }
    getPlayerById(id) {
        return this._players.find((p) => p.id === id);
    }
    desconnectPlayer(id) {
        const player = this._players.find((p) => p.id === id);
        if (!player)
            return;
        player.online = false;
        return;
    }
    removePlayer(id) {
        this._players = this._players.filter((p) => p.id !== id);
    }
    setStage(stage) {
        this._gameState.stage = stage;
    }
    nextStage() {
        const currentIndex = STAGES.indexOf(this._gameState.stage);
        const nextIndex = (currentIndex + 1) % STAGES.length;
        this._gameState.stage = STAGES[nextIndex === 0 ? 1 : nextIndex];
    }
    setImpostorMode(mode) {
        this._gameState.doubleImpostor = mode;
    }
    setRoundHost(player) {
        this._gameState.roundHost = player;
    }
    setImpostor(username) {
        this._gameState.impostor = username;
    }
    addItem(item) {
        this._gameState.items.push(item);
    }
    markItemAsPlayed(item) {
        this._alreadyPlayed.push(item);
        this._gameState.items = [];
    }
    resetPlayedItems() {
        this._alreadyPlayed = [];
    }
}
//# sourceMappingURL=Server.js.map