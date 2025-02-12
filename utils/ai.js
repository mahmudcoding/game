import { AI_ENABLED } from "../constants/constants.js";
import { gameState } from "../index.js";
import { UNITS, DEFENSES, BUFFS } from "../constants/constants.js";
import { spawnUnit, buildDefense, activateBuff } from "./helper.js";
export function aiPlay() {
    if (!AI_ENABLED) return;

    const aiPlayer = gameState.players[1];
    const humanPlayer = gameState.players[0];
    const enemyTowerHP = humanPlayer.towerHP;

    // 1. Prioritize Tower Attacks: If the human tower is vulnerable, focus on attacking it.
    const attackUnits = ["swordsman", "bowman", "cavalry", "arcubalist"];
    for (const unitType of attackUnits) {
      if (aiPlayer.gold >= UNITS[unitType].cost && enemyTowerHP < 500) {
        // Example threshold
        spawnUnit(1, unitType);
        return; // Stop after spawning one unit to allow other actions
      }
    }

    // 2. Balanced Unit Production: Create a mix of unit types.
    const unitChoices = ["swordsman", "bowman", "cavalry", "arcubalist"];
    const randomUnit =
      unitChoices[Math.floor(Math.random() * unitChoices.length)];
    if (aiPlayer.gold >= UNITS[randomUnit].cost) {
      spawnUnit(1, randomUnit);
      return;
    }

    // 3. Strategic Defenses: Build defenses to protect the tower.
    const defenseChoices = ["wood", "stone", "iron", "archer"];
    const randomDefense =
      defenseChoices[Math.floor(Math.random() * defenseChoices.length)];
    if (
      aiPlayer.gold >= DEFENSES[randomDefense].cost &&
      aiPlayer.defenses.length < 4
    ) {
      // Limit number of defenses
      buildDefense(1, randomDefense);
      return;
    }

    // 4. Timed Buff Usage: Use buffs strategically (e.g., before a major attack).
    const buffChoices = ["reinforce", "poison", "warcry", "heal"];
    const randomBuff =
      buffChoices[Math.floor(Math.random() * buffChoices.length)];
    if (
      aiPlayer.gold >= BUFFS[randomBuff].cost &&
      !aiPlayer.buffs[randomBuff]
    ) {
      // Don't use the same buff twice while active
      activateBuff(1, randomBuff);
      return;
    }
  }
  