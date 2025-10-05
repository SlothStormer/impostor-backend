import type { Server } from "socket.io";
import type { GameServer } from "./Server.js";
import { Player } from "./Player.js";

export class SocketHandler {
    private io: Server;
    private gameServer: GameServer;

    constructor(io: Server, gameServer: GameServer) {
        this.io = io;
        this.gameServer = gameServer;
    }

    public initialize() {
        this.io.on("connection", (socket) => {
            console.log("Nueva conexion, id:", socket.id);

            socket.on("player connected", ({ username }) => {
                const player = this.gameServer.getPlayerByUsername(username);
                if (!player) {
                    const newPlayer = new Player(username, socket.id);
                    this.gameServer.addPlayer(newPlayer);
                    this.emmitState();
                    console.log("Jugador conectado:", username);
                    return;
                }

                player.connect(socket.id);
                console.log("Juegador reconectado:", username);
                this.emmitState();
                return;
            })

            socket.on("next stage", () => {
                this.gameServer.nextStage();
                this.emmitState();
            })

            socket.on("player item", (item) => {
                this.gameServer.addItem(item);
                this.emmitState();
                if (this.gameServer.getCurrentItemsAmount() === this.gameServer.getPlayersAmount()) {
                    console.log("Todos los jugadores enviaron su item");
                    setTimeout(() => {
                        this.gameServer.nextStage();
                        this.emmitState();
                    }, 1000);
                }
            })

            socket.on("player vote", ({ from, to }) => {
                this.gameServer.addVote(from, to);
                console.log(from, "Voto encontra de", to)
                this.emmitState();
            })

            socket.on("disconnect", () => {
                this.gameServer.desconnectPlayer(socket.id);
                this.emmitState();
            })

            socket.on("player disconnect", () => {
                this.gameServer.removePlayer(socket.id);
                this.emmitState();
            });

            /* -----| Comandos de admin |----- */

            socket.on("debug", () => {
                console.log(this.gameServer.getState());
                this.io.emit("debug", this.gameServer.getState());
                this.emmitState();
            })

            socket.on("reset votes", () => {
                this.gameServer.resetVotes();
                this.emmitState();
            })

            socket.on("remove player", (id) => {
                this.gameServer.removePlayer(id);
                this.emmitState();
            })

            socket.on("set stage", (stage) => {
                this.gameServer.setStage(stage);
                this.emmitState();
            })

            socket.on("next turn", () => {
                this.gameServer.nextTurn();
                this.emmitState();
            })
        })
    }

    private emmitState() {
        this.io.emit("state", this.gameServer.getState());
    }
}