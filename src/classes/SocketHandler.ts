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
                    return;
                }

                player.connect(socket.id);
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
            })

            socket.on("player disconnected", () => {
                this.gameServer.desconnectPlayer(socket.id);
                this.emmitState();
            })

            /* -----| Comandos de admin |----- */

            socket.on("debug", () => {
                console.log(this.gameServer.getState());
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