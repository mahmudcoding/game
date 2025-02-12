import { GAME_HEIGHT, GAME_WIDTH, IMAGES } from "../constants/constants.js";
import { checkImagesLoaded } from "../index.js";
import { getGamePaused, setGamePaused } from "../index.js";
import { Defense } from "../class/Defense.js";
import { Unit } from "../class/Unit.js";
import { UNITS, DEFENSES, BUFFS } from "../constants/constants.js";
import {gameLoop} from "./gameloop.js";
 let gameState = {
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
export function loadImages() {
    for (const type in IMAGES.units) {
      IMAGES.units[type].src = `./assets/${type}.png`;
      IMAGES.units[type].onerror = (error) => {
        console.error(`Error loading unit image ${type}:`, error);
      };
    }
    for (const type in IMAGES.towers) {
      IMAGES.towers[type].src = `assets/${type}.png`;
      IMAGES.towers[type].onerror = (error) => {
        console.error(`Error loading tower image ${type}:`, error);
      };
    }

    IMAGES.mainTower.src = "assets/maintower.png";
    IMAGES.mainTower.onerror = (error) => {
      console.error("Error loading main tower image:", error);
    };
    IMAGES.mainTower.onload = checkImagesLoaded;
  }

  // Initialize defenses at the start of the game
export function initializeDefenses() {
    // Player 1 defenses
    gameState.players[0].defenses.push(
      new Defense(0, "wood", 200, GAME_HEIGHT / 2)
    );
    gameState.players[0].defenses.push(
      new Defense(0, "archer", 400, GAME_HEIGHT / 2)
    );

    // Player 2 defenses
    gameState.players[1].defenses.push(
      new Defense(1, "wood", GAME_WIDTH - 200, GAME_HEIGHT / 2)
    );
    gameState.players[1].defenses.push(
      new Defense(1, "archer", GAME_WIDTH - 400, GAME_HEIGHT / 2)
    );
  }

  // Spawn unit function
export  function spawnUnit(player, type) {
    const unitCost = UNITS[type].cost;
    if (gameState.players[player].gold >= unitCost) {
      const startX = player === 0 ? 100 : GAME_WIDTH - 100;
      const startY = GAME_HEIGHT / 2;
      gameState.players[player].units.push(
        new Unit(player, type, startX, startY)
      );
      gameState.players[player].gold -= unitCost;
      updateUI();
    }
  }

  // Build defense function
export  function buildDefense(player, type) {
    const defenseCost = DEFENSES[type].cost;
    if (gameState.players[player].gold >= defenseCost) {
      const x = player === 0 ? 300 : GAME_WIDTH - 300;
      const y = GAME_HEIGHT / 2;
      gameState.players[player].defenses.push(
        new Defense(player, type, x, y)
      );
      gameState.players[player].gold -= defenseCost;
      updateUI();
    }
  }

  // Activate buff function
export  function activateBuff(player, type) {
    const buffCost = BUFFS[type].cost;
    if (gameState.players[player].gold >= buffCost) {
      gameState.players[player].buffs[type] = true;
      gameState.players[player].gold -= buffCost;
      setTimeout(() => {
        gameState.players[player].buffs[type] = false;
      }, BUFFS[type].duration);
      updateUI();
    }
  }

  // Update UI function
export  function updateUI() {
    document.getElementById("p1-gold").textContent =
      gameState.players[0].gold;
    document.getElementById("p1-hp").textContent =
      gameState.players[0].towerHP;
    document.getElementById("p2-gold").textContent =
      gameState.players[1].gold;
    document.getElementById("p2-hp").textContent =
      gameState.players[1].towerHP;
  }

export function cleanupEntities() {
    // Clean up dead units
    for (let player of gameState.players) {
      player.units = player.units.filter((unit) => unit.hp > 0);
      player.defenses = player.defenses.filter((defense) => defense.hp > 0);
    }

    // Clean up completed projectiles
    gameState.projectiles = gameState.projectiles.filter((projectile) => {
      return (
        projectile.x !== projectile.targetX ||
        projectile.y !== projectile.targetY
      );
    });
  }

export function generateGold() {
    for (let player of gameState.players) {
      player.gold += 10; // Adjust the amount of gold generated
    }
    updateUI();
  }


export  function togglePause() {
    setGamePaused(!getGamePaused());
    const pauseButton = document.getElementById("pause-button");
    pauseButton.textContent = getGamePaused() ? "Resume" : "Pause"; // Change button text
    if (!getGamePaused) {
      gameLoop(); // Restart game loop if resumed
    }
  }
 
