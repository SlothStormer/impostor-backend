import type { GameServer } from "../classes/Server.js";

export interface GameMode {
    name: string;
    initialize(server: GameServer): void;
    startRound(server: GameServer): void;
    endRound(server: GameServer): void;
}