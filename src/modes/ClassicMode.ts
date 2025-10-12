import type { Player } from "../classes/Player.js";
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

  roundVotes(server: GameServer, from: string, to: string): void {
    server.addVote(from, to);
    console.log(from, "Voto encontra de", to);

    let votes = server.getVotesToPlayer(to);

    if (votes.length > server.getPlayersAmount(true) / 2) {
      const player = server.getPlayerByUsername(to);
      player?.setIsEliminated(true);

      if (player?.username === server.getImpostor()) {
        server.nextStage();
        server.setWinner("PLAYERS");
      } else {
        console.log("Quedan 2 jugadores?", server.getPlayersAmount(true));
        console.log(
          "El impostor fue eliminado?",
          server.getPlayers().find((p) => p.username === server.getImpostor())
            ?.isEliminated
        );
        if (
          server.getPlayersAmount(true) === 2 &&
          !server.getPlayers().find((p) => p.username === server.getImpostor())
            ?.isEliminated
        ) {
          server.setWinner("IMPOSTORS");
          server.nextStage();
        }
      }
    }
  }
}
