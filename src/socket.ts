import chalk from "chalk";
import type { Server, Socket } from "socket.io";
import { blankItem, broadcastState, getPlayerById, systemMessage } from "./utils/helpers.js";

const STAGES = ["BOOKING", "PREROUND", "ROUND", "FINISH"];

export default function socketLogic(io: Server, serverState: ServerState) {
  io.on("connection", (socket) => {
    socket.on("player connected", ({ username }) => {
      connectPlayer(socket, io, serverState, username);
    });

    socket.on("next stage", () => nextStage(io, serverState));

    socket.on("player item", (item) => {
      const player = getPlayerById(serverState, socket.id);
      if (!player) return;

      serverState.gameState.items.push(item);
      broadcastState(io, serverState);
      systemMessage(
        io,
        `[player item] Jugador ${player.username} seleccionó el item`
      );
    });

    // ----------------- Desconexión -----------------
    socket.on("disconnect", () => {
      disconnectPlayer(socket, io, serverState);
    });
  });
}

// ==================== Conexion del juego ====================
function connectPlayer(
  socket: Socket,
  io: Server,
  serverState: ServerState,
  username: string
) {
  let player = serverState.players.find((p) => p.username === username);

  if (!player) {
    // si es el primer jugador conectado -> host inicial
    const isFirst = serverState.players.length === 0;
    player = { username, id: socket.id, isOnline: true };
    serverState.players.push(player);

    if (isFirst) {
      serverState.gameState.roundHost = {
        username,
        id: socket.id,
        isOnline: true,
      };
    }
  } else {
    player.id = socket.id;
    player.isOnline = true;
  }

  broadcastState(io, serverState);
  systemMessage(io, `[connect] Jugador ${username} conectado`);
}

function disconnectPlayer(
  socket: Socket,
  io: Server,
  serverState: ServerState
) {
  const player = getPlayerById(serverState, socket.id);
  if (!player) return;

  player.isOnline = false;
  broadcastState(io, serverState);
  systemMessage(io, `[disconnect] Jugador ${player.username} desconectado`);
}

// ==================== Logica del juego ====================

function nextStage(io: Server, serverState: ServerState) {
  const currentStage = serverState.gameState.stage;
  const next =
    currentStage !== "FINISH"
      ? STAGES[STAGES.indexOf(currentStage) + 1]
      : "PREROUND";

  serverState.gameState.stage = next as GameState["stage"];
  handleStageLogic(io, serverState, next as string);
  broadcastState(io, serverState);
}

function handleStageLogic(io: Server, serverState: ServerState, stage: string) {
  if (stage === "PREROUND") {
    // reset de estado
    serverState.gameState.items = [];
    serverState.gameState.hostItem = blankItem();
    serverState.gameState.impostor = "";

    // pasar host a siguiente jugador
    const hostIndex = serverState.players.findIndex(
      (p) => p.username === serverState.gameState.roundHost.username
    );
    const nextHost =
      serverState.players[
        hostIndex === serverState.players.length - 1 ? 0 : hostIndex + 1
      ];

    if (!nextHost) {
      systemMessage(io, `[stage] No hay jugadores disponibles`);
      return;
    }

    serverState.gameState.roundHost = nextHost;
    systemMessage(io, `[stage] Nuevo host: ${nextHost.username}`);
  }

  if (stage === "ROUND") {
    // asignar impostor
    const impostor = pickRandomImpostor(serverState);
    serverState.gameState.impostor = impostor;

    const allItems = serverState.gameState.items;
    let pool = allItems.filter((item) => item.username !== impostor);

    if (pool.length === 0) {
      pool = allItems; // fallback: todos los items si solo hay del impostor
      systemMessage(
        io,
        `[round] Todos los items son del impostor, usando igualmente`
      );
    }

    if (pool.length > 0) {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];

      if (!randomItem) return;

      serverState.gameState.hostItem = randomItem;
      serverState.alreadyPlayed.push(randomItem);

      systemMessage(io, `[round] Item elegido: ${randomItem.item}`);
    } else {
      serverState.gameState.hostItem = blankItem();
      systemMessage(io, `[round] No hay items disponibles`);
    }
  }
}

function pickRandomImpostor(serverState: ServerState) {
  const candidates = serverState.players;
  //.filter((p) => p.username !== serverState.gameState.roundHost.username);

  if (candidates.length === 0) return "";
  const impostor =
    candidates[Math.floor(Math.random() * candidates.length)]!.username;

  systemMessage(null, `[impostor] Seleccionado: ${impostor}`);
  return impostor;
}
