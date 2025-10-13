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

  roundVotes(server: GameServer, from: string, to: string): void {
    server.addVote(from, to);
    console.log(from, "Voto encontra de", to);

    let votes = server.getVotesToPlayer(to);

    if (votes.length > server.getPlayersAmount(true) / 2) {
      const player = server.getPlayerByUsername(to);
      player?.setIsEliminated(true);
      server.resetVotes();

      const impostors = server.getImpostors();

      const i1 = impostors[0]!;
      const i2 = impostors[1]!;

      if (
        server.getPlayerByUsername(i1)?.isEliminated &&
        server.getPlayerByUsername(i2)?.isEliminated
      ) {
        server.setWinner("PLAYERS");
        server.nextStage();
        return;
      }

      if (server.getPlayerByUsername(i1)?.isEliminated && !server.getPlayerByUsername(i2)?.isEliminated) {
        if (server.getPlayersAmount(true) === 2) {
          server.setWinner("IMPOSTORS");
          server.nextStage();
          return;
        }
      }
      if (!server.getPlayerByUsername(i1)?.isEliminated && server.getPlayerByUsername(i2)?.isEliminated) {
        if (server.getPlayersAmount(true) === 2) {
          server.setWinner("IMPOSTORS");
          server.nextStage();
          return;
        }
      }
    }
  }
}
