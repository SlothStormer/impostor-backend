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

    const votesCounts = server.getVotesCount();

    const maxVotes = Math.max(...Object.values(votesCounts));
    const topPlayers = Object.keys(votesCounts).filter(
      (p) => votesCounts[p] === maxVotes
    );

    const totalPlayers = server.getPlayersAmount(true);

    if (maxVotes > totalPlayers / 2 && topPlayers.length === 1) {
      const eliminated = server.getPlayerByUsername(topPlayers[0]!);
      eliminated?.setIsEliminated(true);
      server.resetVotes();

      if (eliminated?.username === server.getImpostor()) {
        server.setWinner("PLAYERS");
        server.nextStage();
      } else {
        if (
          totalPlayers === 2 &&
          !server.getPlayers().find((p) => p.username === server.getImpostor())
            ?.isEliminated
        ) {
          server.setWinner("IMPOSTORS");
          server.nextStage();
        }
      }
    }

    if (topPlayers.length > 1) {
      console.log("Empate entre:", topPlayers);
    }
  }
}
