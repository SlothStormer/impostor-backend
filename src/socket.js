import chalk from "chalk";

const STAGES = ["BOOKING", "PREROUND", "ROUND", "FINISH"];

export default function socketLogic(io, serverState) {
  io.on("connection", (socket) => {
    // ----------------- Conexión -----------------
    socket.on("player connected", ({ username }) => {
      connectPlayer(socket, io, serverState, username);
    });

    // ----------------- Flujo del juego -----------------
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

// ==================== Helpers ====================

function getPlayerById(serverState, id) {
  return serverState.players.find((p) => p.id === id);
}

function broadcastState(io, serverState) {
  io.emit("server state", serverState);
}

function systemMessage(io, msg) {
  if (io) io.emit("system message", msg);
  console.log(chalk.blue(msg));
}

// ==================== Player Handling ====================

function connectPlayer(socket, io, serverState, username) {
  let player = serverState.players.find((p) => p.username === username);

  if (!player) {
    // si es el primer jugador conectado -> host inicial
    const isFirst = serverState.players.length === 0;
    player = { username, id: socket.id, isOnline: true };
    serverState.players.push(player);

    if (isFirst) {
      serverState.gameState.roundHost = { username, id: socket.id };
    }
  } else {
    player.id = socket.id;
    player.isOnline = true;
  }

  broadcastState(io, serverState);
  systemMessage(io, `[connect] Jugador ${username} conectado`);
}

function disconnectPlayer(socket, io, serverState) {
  const player = getPlayerById(serverState, socket.id);
  if (!player) return;

  player.isOnline = false;
  broadcastState(io, serverState);
  systemMessage(io, `[disconnect] Jugador ${player.username} desconectado`);
}

// ==================== Game Flow ====================

function nextStage(io, serverState) {
  const currentStage = serverState.gameState.stage;
  const next =
    currentStage !== "FINISH"
      ? STAGES[STAGES.indexOf(currentStage) + 1]
      : "PREROUND";

  serverState.gameState.stage = next;
  handleStageLogic(io, serverState, next);
  broadcastState(io, serverState);
}

function handleStageLogic(io, serverState, stage) {
  if (stage === "PREROUND") {
    // reset de estado
    serverState.gameState.items = [];
    serverState.gameState.hostItem = "";
    serverState.gameState.impostor = "";

    // pasar host a siguiente jugador
    const hostIndex = serverState.players.findIndex(
      (p) => p.username === serverState.gameState.roundHost.username
    );
    const nextHost =
      serverState.players[
        hostIndex === serverState.players.length - 1 ? 0 : hostIndex + 1
      ];

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
      serverState.gameState.hostItem = randomItem;
      serverState.alreadyPlayed.push(randomItem.item);

      systemMessage(io, `[round] Item elegido: ${randomItem.item}`);
    } else {
      serverState.gameState.hostItem = "";
      systemMessage(io, `[round] No hay items disponibles`);
    }
  }
}

function pickRandomImpostor(serverState) {
  const candidates = serverState.players;
  //.filter((p) => p.username !== serverState.gameState.roundHost.username);

  if (candidates.length === 0) return "";
  const impostor =
    candidates[Math.floor(Math.random() * candidates.length)].username;

  systemMessage(null, `[impostor] Seleccionado: ${impostor}`);
  return impostor;
}
