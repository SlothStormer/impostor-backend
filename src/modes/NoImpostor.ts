import type { GameServer } from "../classes/Server.js";
import type { GameMode } from "./GameMode.js";

export class NoImpostor implements GameMode {
  name = "No Impostor";

  startRound(server: GameServer): void {
    const onlinePlayers = server.getPlayers().filter((p) => p.online);
    if (onlinePlayers.length < 2) return;

    // seleccionar el item
    const items = server.getItems();
    if (items.length === 0) {
        console.log("No habia items")
        return
    };

    const item = items[Math.floor(Math.random() * items.length)];

    console.log(item);

    server.setHostItem(item!);
    server.setPlayerTurn(onlinePlayers);
  }

  endRound(server: GameServer): void {}
}
