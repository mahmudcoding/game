import { generateGold, loadImages, initializeDefenses  } from "./utils/helper.js";
import { IMAGES } from "./constants/constants.js";
import {gameLoop} from "./utils/gameloop.js";
import {aiPlay} from "./utils/ai.js";
import { AI_DELAY } from "./constants/constants.js";
import { restartGame } from "./utils/restart.js";
import { spawnUnit, buildDefense, activateBuff} from "./utils/helper.js";
import { togglePause } from "./utils/helper.js";
let gamePaused = true;
export const getGamePaused = () => gamePaused;
export const setGamePaused = (value) => (gamePaused = value);

window.spawnUnit = spawnUnit;
window.buildDefense = buildDefense;
window.activateBuff = activateBuff;
window.togglePause = togglePause;
window.restartGame = restartGame;
const GOLD_INTERVAL = 3000;
setInterval(generateGold, GOLD_INTERVAL);
loadImages(); 


let imagesLoadedCount = 0;
const totalImages =
  Object.keys(IMAGES.units).length + Object.keys(IMAGES.towers).length;
export function checkImagesLoaded() {
  imagesLoadedCount++;
  if (imagesLoadedCount === totalImages) {
    initializeDefenses(); 
    gameLoop(); 
  }
}

for (const type in IMAGES.units) {
  IMAGES.units[type].onload = checkImagesLoaded;
}
for (const type in IMAGES.towers) {
  IMAGES.towers[type].onload = checkImagesLoaded;
}
setInterval(aiPlay, AI_DELAY);
initializeDefenses();
gameLoop();

