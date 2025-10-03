interface Player {
  username: string;
  id: string;
  isOnline: boolean;
}

interface Item {
  username: string;
  hint: string;
  item: string;
}

interface GameState {
  stage: "BOOKING" | "PREROUND" | "ROUND" | "FINISH";
  mode: "WITH_HOST" | "WITHOUT_HOST";
  items: Item[];
  roundHost: Player;
  hostItem: Item;
  impostor: string;
}

interface ServerState {
  players: Player[];
  alreadyPlayed: Item[];
  gameState: GameState;
}
