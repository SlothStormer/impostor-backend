import type { GameServer } from "../classes/Server.js";

export interface GameMode {
    name: string;
    startRound(server: GameServer): void;
    endRound(server: GameServer): void;
}