import type { GameServer } from "../classes/Server.js";
import type { GameMode } from "./GameMode.js";

export class ChaosMode implements GameMode {
  name = "Modo Caos";

  startRound(server: GameServer): void {}

  endRound(server: GameServer): void {}
}
