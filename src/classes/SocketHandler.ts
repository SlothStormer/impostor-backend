import type { Server } from "socket.io";
import type { GameServer } from "./Server.js";
import { Player } from "./Player.js";
import { randomUUID } from "crypto";

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
                    const newPlayer = new Player(username, randomUUID(), socket.id);
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
                
                let votes = this.gameServer.getVotesToPlayer(to);

                if (votes.length > this.gameServer.getPlayersAmount(true) / 2) {
                    const player = this.gameServer.getPlayerByUsername(to);
                    player?.setIsEliminated(true);


                    if (this.gameServer.isDobleImpostor()) {
                        const impostors = this.gameServer.getImpostors();

                        const i1 = impostors[0]!;
                        const i2 = impostors[1]!;

                        if (this.gameServer.getPlayerByUsername(i1)?.isEliminated && this.gameServer.getPlayerByUsername(i2)?.isEliminated) {
                            this.gameServer.nextStage();
                        }

                    } else {
                        if (player?.username === this.gameServer.getImpostor()) {
                            this.gameServer.nextStage();
                        }
                    }
                }
                this.emmitState();
            })

            socket.on("disconnect", () => {
                this.gameServer.disconnectPlayer(socket.id);
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

            socket.on("mode change", (mode) => {
                this.gameServer.setImpostorMode(mode);
                this.emmitState();
            })
        })
    }

    private emmitState() {
        this.io.emit("state", this.gameServer.getState());
    }
}