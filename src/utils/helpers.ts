import chalk from "chalk";
import type { Server } from "socket.io";
import type { Player } from "../classes/Player.js";
/*
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
*/

function obtenerDosDistintos(arr: Player[]): string[] | undefined {
  const i1 = Math.floor(Math.random() * arr.length);
  let i2 = Math.floor(Math.random() * arr.length);
  
  // asegurarse de que i2 sea distinto de i1
  while (i2 === i1) {
    i2 = Math.floor(Math.random() * arr.length);
  }

  return [arr[i1]!.username, arr[i2]!.username];
}

export { obtenerDosDistintos };