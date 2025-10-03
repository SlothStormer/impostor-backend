import { Player } from "./classes/Player.js";
const STAGES = ["BOOKING", "PREROUND", "ROUND", "FINISH"];
/*
socket.on("player connected")
socket.on("next stage")
socket.on("player item")
socket.on("disconnect")
*/
export default function socketLogic(io, GameServer) {
    io.on("connection", (socket) => {
        socket.on("player connected", ({ username }) => {
            GameServer.addPlayer(new Player(username, socket.id));
        });
        socket.on("next stage", () => GameServer.nextStage());
        socket.on("player item", (item) => { });
        // ----------------- Desconexión -----------------
        socket.on("disconnect", () => { });
        socket.on("debug", () => {
            console.log(GameServer.getState());
        });
    });
}
//# sourceMappingURL=socket.js.map