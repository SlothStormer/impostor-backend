import type { Player } from "../classes/Player.js";

function obtenerDosDistintos(arr: Player[]): string[] | undefined {
  const i1 = Math.floor(Math.random() * arr.length);
  let i2 = Math.floor(Math.random() * arr.length);
  
  // asegurarse de que i2 sea distinto de i1
  while (i2 === i1) {
    i2 = Math.floor(Math.random() * arr.length);
  }

  return [arr[i1]!.username, arr[i2]!.username];
}

export { obtenerDosDistintos };