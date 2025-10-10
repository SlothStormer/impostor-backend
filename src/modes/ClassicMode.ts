import type { GameServer } from "../classes/Server.js";
import type { GameMode } from "./GameMode.js";

export class ClassicMode implements GameMode {
  name = "Clásico";

  startRound(server: GameServer): void {
    const onlinePlayers = server.getPlayers().filter((p) => p.online);
    if (onlinePlayers.length < 2) return;

    // Seleccionar el impostor
    const impostor =
      onlinePlayers[Math.floor(Math.random() * onlinePlayers.length)];
    server.setImpostor(impostor!.username);

    // seleccionar el item
    const itemsFiltered = server
      .getItems()
      .filter((item) => item.username !== impostor!.username);
    if (itemsFiltered.length === 0) return;

    const item =
      itemsFiltered[Math.floor(Math.random() * itemsFiltered.length)];

    server.setHostItem(item!);
    server.setPlayerTurn(onlinePlayers);
  }

  handleVotes(server: GameServer): void {}

  endRound(server: GameServer): void {}
}
