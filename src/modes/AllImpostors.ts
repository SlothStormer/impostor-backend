import type { GameServer } from "../classes/Server.js";
import type { GameMode } from "./GameMode.js";

export class AllImpostors implements GameMode {
  name = "Todos Impostores";

  initialize(server: GameServer): void {
    server.resetImpostor();
    server.resetHostItem();
    server.resetElimitedPlayers();
  }

  startRound(server: GameServer): void {
      server.setImpostors(server.getPlayers().map(p => p.username))
  }

  endRound(server: GameServer): void {
      
  }
}