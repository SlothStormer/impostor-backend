interface Item {
  username: string;
  hint: string | undefined;
  item: string;
}

interface Vote {
  from: Player;
  to: Player;
}

interface GameState {
  stage: Stage;
  doubleImpostor: boolean;
  items: Item[];
  votes: Vote[];
  roundHost: Player | null;
  playerTurn: Player | undefined | null;
  hostItem: Item;
  impostor: string;
}