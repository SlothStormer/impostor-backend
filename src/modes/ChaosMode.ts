import type { GameServer } from "../classes/Server.js";
import type { GameMode } from "./GameMode.js";

export class ChaosMode implements GameMode {
  name = "Modo Caos";

  initialize(server: GameServer): void {
    server.resetImpostor();
    server.resetHostItem();
    server.resetElimitedPlayers();
  }

  startRound(server: GameServer): void {}

  endRound(server: GameServer): void {}
}
