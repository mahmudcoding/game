import { getGamePaused, gameState } from "../index.js";
import { IMAGES, GAME_HEIGHT, GAME_WIDTH, ctx } from "../constants/constants.js";
import { cleanupEntities } from "./helper.js";

export function gameLoop() {
    if (getGamePaused()) {
      return; // Do nothing if game is paused
    }
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw towers
    if (IMAGES.mainTower.complete) {
        ctx.drawImage(
          IMAGES.mainTower,
          GAME_WIDTH - 100,
          GAME_HEIGHT / 2 - 80,
          128,
          128
        );
      } else {
        // Placeholder (optional)
        ctx.fillStyle = "gray";
        ctx.fillRect(
          GAME_WIDTH - 100,
          GAME_HEIGHT / 2 - 150,
          128,
          128
        );
      }
      if (IMAGES.mainTower.complete) {
        ctx.drawImage(
          IMAGES.mainTower,
          0,
          GAME_HEIGHT / 2 - 80,
          128,
          128
        );
      } else {
        // Placeholder (optional)
        ctx.fillStyle = "gray";
        ctx.fillRect(
          GAME_WIDTH - 100,
          GAME_HEIGHT / 2 - 150,
          128,
          128
        );
      }
    cleanupEntities();
    // Update and draw units
    for (let player of gameState.players) {
      for (let unit of player.units) {
        unit.update();
        unit.draw();
      }
    }

    // Update and draw defenses
    for (let player of gameState.players) {
      for (let defense of player.defenses) {
        defense.update();
        defense.draw();
      }
    }

    // Update and draw projectiles
    for (let projectile of gameState.projectiles) {
      projectile.update();
      projectile.draw();
    }

    // Check for game over
    if (
      gameState.players[0].towerHP <= 0 ||
      gameState.players[1].towerHP <= 0
    ) {
      const winner =
        gameState.players[0].towerHP <= 0 ? "Player 2" : "Player 1";
      document.getElementById(
        "winner-text"
      ).textContent = `${winner} Wins!`;
      document.getElementById("game-over").style.display = "block";
      return;
    }

    requestAnimationFrame(gameLoop);
  }
