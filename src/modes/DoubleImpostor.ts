import type { GameServer } from "../classes/Server.js";
import { obtenerDosDistintos } from "../utils/helpers.js";
import type { GameMode } from "./GameMode.js";

export class DoubleImpostor implements GameMode {
  name = "Doble Impostor";

  startRound(server: GameServer): void {
    const onlinePlayers = server.getPlayers().filter((p) => p.online);
    if (onlinePlayers.length < 2) return;

    const impostors = obtenerDosDistintos(onlinePlayers);

    if (!impostors) return;

    server.setImpostors(impostors);
    const itemsFiltered = server
      .getItems()
      .filter(
        (item) =>
          item.username !== impostors[0] && item.username !== impostors[1]
      );
    if (itemsFiltered.length === 0) return;

    const item =
      itemsFiltered[Math.floor(Math.random() * itemsFiltered.length)];

    server.setHostItem(item!);
    server.setPlayerTurn(onlinePlayers);
  }

  endRound(server: GameServer): void {}
}
