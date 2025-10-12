import type { GameServer } from "../classes/Server.js";
import type { GameMode } from "./GameMode.js";

export class AllImpostors implements GameMode {
  name = "Todos Impostores";

  startRound(server: GameServer): void {
    server.setImpostors(server.getPlayers().map((p) => p.username));
  }

  roundVotes(server: GameServer, from: string, to: string): void {
    server.addVote(from, to);
    console.log(from, "Voto encontra de", to);

    let votes = server.getVotesToPlayer(to);

    if (votes.length > server.getPlayersAmount(true) / 2) {
      const player = server.getPlayerByUsername(to);
      player?.setIsEliminated(true);

      if (server.getPlayersAmount(true) === 2) {
        server.nextStage();
        server.setWinner("PLAYERS");
      }
    }
  }
}
