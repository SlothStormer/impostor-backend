import type { GameServer } from "../classes/Server.js";
import type { GameMode } from "./GameMode.js";

export class ChaosMode implements GameMode {
  name = "Modo Caos";

  startRound(server: GameServer): void {}

  roundVotes(server: GameServer, from: string, to: string): void {}
}
