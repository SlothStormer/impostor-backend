import chalk from "chalk";
import type { Server } from "socket.io";

function getPlayerById(serverState: ServerState, id: string) {
  return serverState.players.find((p) => p.id === id);
}

function broadcastState(io: Server, serverState: ServerState) {
  io.emit("server state", serverState);
}

function systemMessage(io: Server | null, msg: string) {
  if (io) io.emit("system message", msg);
  console.log(chalk.blue(msg));
}

function blankItem() {
  return { username: "", hint: "", item: "" };
}

export { getPlayerById, broadcastState, systemMessage, blankItem };