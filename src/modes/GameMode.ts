import type { Player } from "../classes/Player.js";
import type { GameServer } from "../classes/Server.js";

export interface GameMode {
    name: string;
    startRound(server: GameServer): void;
    roundVotes(server: GameServer, from: string, to: string): void;
    //endRound(server: GameServer): void;
}