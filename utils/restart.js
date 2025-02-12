import { initializeDefenses, updateUI } from "./helper.js";
import { gameState, setGamePaused } from "../index.js";
import { gameLoop } from "./gameloop.js";
export function restartGame() {
    gameState = {
      players: [
        {
          gold: 200,
          towerHP: 1000,
          units: [],
          defenses: [],
          buffs: {
            reinforce: false,
            poison: false,
            warcry: false,
            heal: false,
          },
        },
        {
          gold: 200,
          towerHP: 1000,
          units: [],
          defenses: [],
          buffs: {
            reinforce: false,
            poison: false,
            warcry: false,
            heal: false,
          },
        },
      ],
      projectiles: [],
    };
    initializeDefenses();
    updateUI();
    document.getElementById("game-over").style.display = "none";
    setGamePaused(true)
    document.getElementById("pause-button").textContent = "Pause";
    gameLoop();
  }
