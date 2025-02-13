const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const IMAGES = {
  // Organize images by type
  units: {
    swordsman: new Image(),
    bowman: new Image(),
    cavalry: new Image(),
    arcubalist: new Image(),
  },
  towers: {
    wood: new Image(),
    stone: new Image(),
    iron: new Image(),
    archer: new Image(),
  },
  mainTower: new Image(),
};
// Game constants
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const TOWER_WIDTH = 100;
const TOWER_HEIGHT = 200;
const UNIT_SIZE = 30;
const WALL_WIDTH = 30;
const WALL_HEIGHT = 80;
const AI_ENABLED = true;
const AI_DELAY = 1000;
let gamePaused = true;

// Add path definitions
const PATHS = [
  { y: GAME_HEIGHT * 0.2, towers: [] }, // Top path
  { y: GAME_HEIGHT * 0.5, towers: [] }, // Middle path
  { y: GAME_HEIGHT * 0.8, towers: [] }, // Bottom path
];

// Add drag state tracking
let draggedUnit = null;
let draggedTower = null;
let selectedPath = null;

function togglePause() {
  gamePaused = !gamePaused;
  const pauseButton = document.getElementById("pause-button");
  pauseButton.textContent = gamePaused ? "Resume" : "Pause"; // Change button text
  if (!gamePaused) {
    gameLoop(); // Restart game loop if resumed
  }
}
// Game state
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

// Unit configurations
const UNITS = {
  swordsman: {
    cost: 50,
    hp: 320,
    damage: 20,
    speed: 2,
    range: 30,
    color: "#e74c3c",
  },
  bowman: {
    cost: 60,
    hp: 280,
    damage: 15,
    speed: 1.5,
    range: 150,
    color: "#27ae60",
  },
  cavalry: {
    cost: 80,
    hp: 330,
    damage: 25,
    speed: 3,
    range: 40,
    color: "#f1c40f",
  },
  arcubalist: {
    cost: 70,
    hp: 300,
    damage: 18,
    speed: 1.8,
    range: 200,
    color: "#9b59b6",
  },
};

// Defense configurations
const DEFENSES = {
  wood: {
    cost: 30,
    hp: 200,
    color: "#795548",
  },
  stone: {
    cost: 50,
    hp: 400,
    color: "#95a5a6",
  },
  iron: {
    cost: 80,
    hp: 600,
    color: "#7f8c8d",
  },
  archer: {
    cost: 100,
    hp: 300,
    damage: 15,
    range: 200,
    color: "#2ecc71",
  },
};

// Buff configurations
const BUFFS = {
  reinforce: {
    cost: 100,
    duration: 10000,
  },
  poison: {
    cost: 120,
    duration: 8000,
  },
  warcry: {
    cost: 150,
    duration: 6000,
  },
  heal: {
    cost: 130,
    duration: 12000,
  },
};
class Unit {
  constructor(player, type, x, y) {
    this.player = player;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = UNIT_SIZE;
    this.height = UNIT_SIZE;
    Object.assign(this, UNITS[type]);
    this.maxHP = this.hp;
    this.direction = player === 0 ? 1 : -1;
    this.attackCooldown = 0;
    this.poisoned = false;
    this.image = IMAGES.units[type];
    this.width = 64;
    this.height = 64;
    this.path = null;
    this.isDragging = false;
    this.canMove = false;
  }
  startDrag() {
    this.isDragging = true;
    this.canMove = false;
  }
  stopDrag(mouseY) {
    this.isDragging = false;
    // Find closest path
    let closestPath = PATHS.reduce((closest, path) => {
      const distance = Math.abs(mouseY - path.y);
      return distance < Math.abs(mouseY - closest.y) ? path : closest;
    });
    this.path = closestPath;
    this.y = closestPath.y;
    this.canMove = true;
  }
  update() {
    if (!this.canMove || this.isDragging) return;

    const pathEndReached =
      this.player === 0 ? this.x >= GAME_WIDTH - 150 : this.x <= 150;

    if (pathEndReached) {
      this.attackMainTower();
      return;
    }

    // ***KEY CHANGE: Prioritize towers on the path***
    let targetTower = null;
    if (this.player === 0) {
      targetTower = this.path.towers.find(
        (t) => t.player !== this.player && t.x > this.x
      ); // Find tower to the right
    } else {
      targetTower = this.path.towers.find(
        (t) => t.player !== this.player && t.x < this.x
      ); // Find tower to the left
    }

    if (targetTower) {
      if (this.isInRange(targetTower)) {
        this.attack(targetTower);
        return; // Stop moving if attacking
      } else {
        // Move towards the tower if not in range
        this.x +=
          this.direction *
          Math.min(
            this.speed,
            Math.abs(targetTower.x - this.x - this.direction * this.range)
          ); // Move closer
      }
    } else {
      // No tower on path, check for other units
      if (this.findTarget()) return; // Stop moving if attacking a unit

      // No units or towers to attack, move towards the end of the path
      this.x += this.direction * this.speed;
    }
  }
  attackMainTower() {
    if (this.attackCooldown <= 0) {
      let damage = this.damage;
      if (gameState.players[this.player].buffs.warcry) {
        damage *= 1.5;
      }
      const enemyPlayer = this.player === 0 ? 1 : 0;
      gameState.players[enemyPlayer].towerHP -= damage;
      this.attackCooldown = 30;

      // Check if main tower is destroyed
      if (gameState.players[enemyPlayer].towerHP <= 0) {
        this.canMove = false; // Stop attacking if main tower is destroyed
      }
    }
  }

  findTarget() {
    const enemyPlayer = this.player === 0 ? 1 : 0;

    // Check for enemy units on ANY path, not just the current one.
    for (const unit of gameState.players[enemyPlayer].units) {
      if (this.isInRange(unit)) {
        this.attack(unit);
        return true;
      }
    }
    return false; // No target found
  }

  isInRange(target) {
    const distance = Math.abs(this.x - target.x);
    return distance < this.range + target.width;
  }

  attack(target) {
    if (this.attackCooldown <= 0) {
      let damage = this.damage;

      // Counter system - only apply if target is a Unit
      if (target instanceof Unit) {
        if (this.isCounter(target.type)) {
          damage *= 2;
        } else if (target.isCounter(this.type)) {
          damage *= 0.5;
        }
      }

      // War cry buff
      if (gameState.players[this.player].buffs.warcry) {
        damage *= 1.5;
      }

      target.hp -= damage;

      // Poison effect - only apply to units
      if (
        gameState.players[this.player].buffs.poison &&
        target instanceof Unit
      ) {
        target.poisoned = true;
      }

      this.attackCooldown = 30;

      // Create projectile effect
      if (this.type === "bowman" || this.type === "arcubalist") {
        gameState.projectiles.push(
          new Projectile(this.x, this.y, target.x, target.y, this.player)
        );
      }
      if (target.hp <= 0) {
        if (target instanceof Defense) {
          // Remove the tower from the path's tower list
          const index = target.path.towers.indexOf(target);
          if (index > -1) {
            target.path.towers.splice(index, 1);
          }
          gameState.players[target.player].defenses.splice(
            gameState.players[target.player].defenses.indexOf(target),
            1
          );
        } else if (target instanceof Unit) {
          gameState.players[target.player].units.splice(
            gameState.players[target.player].units.indexOf(target),
            1
          );
        }
      }
    }
  }

  attackTower(enemyPlayer) {
    if (this.attackCooldown <= 0) {
      let damage = this.damage;
      if (gameState.players[this.player].buffs.warcry) {
        damage *= 1.5;
      }
      gameState.players[enemyPlayer].towerHP -= damage;
      this.attackCooldown = 30;
    }
  }

  isCounter(targetType) {
    const counters = {
      swordsman: "bowman",
      bowman: "cavalry",
      cavalry: "arcubalist",
      arcubalist: "swordsman",
    };
    return counters[this.type] === targetType;
  }

  draw() {
    // Draw unit
    if (this.image.complete) {
      ctx.drawImage(
        this.image,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }

    // Draw health bar
    const healthPercent = this.hp / this.maxHP;
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2 - 10,
      this.width,
      5
    );
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2 - 10,
      this.width * healthPercent,
      5
    );
  }
}

// Defense class
class Defense {
  constructor(player, type, x, y) {
    this.player = player;
    this.type = type;
    this.x = x;
    this.y = y;
    Object.assign(this, DEFENSES[type]);
    this.maxHP = this.hp;
    this.attackCooldown = 0;
    this.image = IMAGES.towers[type];
    this.width = 96;
    this.height = 96;
    this.isDragging = false;
    this.path = null;
  }
  startDrag() {
    this.isDragging = true;
  }
  stopDrag(mouseY) {
    this.isDragging = false;
    // Find closest path
    let closestPath = PATHS.reduce((closest, path) => {
      const distance = Math.abs(mouseY - path.y);
      return distance < Math.abs(mouseY - closest.y) ? path : closest;
    });
    this.path = closestPath;
    this.y = closestPath.y;
    closestPath.towers.push(this);
  }
  update() {
    if (this.type === "archer") {
      this.updateArcherTower();
    }
  }

  updateArcherTower() {
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
      return;
    }

    const enemyPlayer = this.player === 0 ? 1 : 0;
    for (let unit of gameState.players[enemyPlayer].units) {
      if (this.isInRange(unit)) {
        this.attack(unit);
        break;
      }
    }
  }

  isInRange(target) {
    const distance = Math.abs(this.x - target.x);
    return distance < this.range + target.width;
  }

  attack(target) {
    if (this.attackCooldown <= 0) {
      let damage = this.damage;

      // War cry buff
      if (gameState.players[this.player].buffs.warcry) {
        damage *= 1.5;
      }

      target.hp -= damage;
      this.attackCooldown = 30;

      // Create projectile effect
      gameState.projectiles.push(
        new Projectile(this.x, this.y, target.x, target.y, this.player)
      );
    }
  }

  draw() {
    // Draw defense
    if (this.image.complete) {
      ctx.drawImage(
        this.image,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    } else {
      ctx.fillStyle = this.color; // Placeholder
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }

    // Draw health bar
    const healthPercent = this.hp / this.maxHP;
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2 - 10,
      this.width,
      5
    );
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2 - 10,
      this.width * healthPercent,
      5
    );
  }
}

// Projectile class
class Projectile {
  constructor(startX, startY, targetX, targetY, player) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.player = player;
    this.speed = 10;
    this.color = player === 0 ? "#3498db" : "#e74c3c";
  }

  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      this.x = this.targetX;
      this.y = this.targetY;
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

function loadImages() {
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

function spawnUnit(player, type) {
  const unitCost = UNITS[type].cost;
  if (gameState.players[player].gold >= unitCost) {
    const startX = player === 0 ? 100 : GAME_WIDTH - 100;
    // Spawn at middle path by default
    const startY = PATHS[1].y;
    const unit = new Unit(player, type, startX, startY);
    unit.path = PATHS[1];
    gameState.players[player].units.push(unit);
    gameState.players[player].gold -= unitCost;
    updateUI();
  }
}

function initializeDefenses() {
  if (
    gameState.players[0].defenses.length > 0 ||
    gameState.players[1].defenses.length > 0
  )
    return; // Prevent re-initialization

  PATHS.forEach((path, index) => {
    // Player 1 towers
    const defense1 = new Defense(0, "wood", 200, path.y);
    defense1.path = path;
    gameState.players[0].defenses.push(defense1);
    path.towers.push(defense1);

    // Player 2 towers
    const defense2 = new Defense(1, "wood", GAME_WIDTH - 200, path.y);
    defense2.path = path;
    gameState.players[1].defenses.push(defense2);
    path.towers.push(defense2);
  });
}

// Build defense function
function buildDefense(player, type) {
  const maxDefenses = 10; // Total max defenses including initial ones. Adjust as needed.
  if (gameState.players[player].defenses.length >= maxDefenses) return;

  const defenseCost = DEFENSES[type].cost;
  if (gameState.players[player].gold >= defenseCost) {
    let closestPath = null;
    let minDistance = Infinity;

    PATHS.forEach((path) => {
      const distance = Math.abs(path.y - GAME_HEIGHT / 2); // Center of the screen
      if (distance < minDistance) {
        minDistance = distance;
        closestPath = path;
      }
    });

    if (closestPath) {
      const defense = new Defense(
        player,
        type,
        player === 0 ? 300 : GAME_WIDTH - 300,
        closestPath.y
      );
      defense.path = closestPath;
      closestPath.towers.push(defense);
      gameState.players[player].defenses.push(defense);
      gameState.players[player].gold -= defenseCost;
      updateUI();
    }
  }
}

// Activate buff function
function activateBuff(player, type) {
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
function updateUI() {
  document.getElementById("p1-gold").textContent = gameState.players[0].gold;
  document.getElementById("p1-hp").textContent = gameState.players[0].towerHP;
  document.getElementById("p2-gold").textContent = gameState.players[1].gold;
  document.getElementById("p2-hp").textContent = gameState.players[1].towerHP;
}
function cleanupEntities() {
  // Clean up dead units
  for (let player of gameState.players) {
    player.units = player.units.filter((unit) => unit.hp > 0);
    player.defenses = player.defenses.filter((defense) => defense.hp > 0);
  }

  // Clean up completed projectiles
  gameState.projectiles = gameState.projectiles.filter((projectile) => {
    return (
      projectile.x !== projectile.targetX || projectile.y !== projectile.targetY
    );
  });
}
const GOLD_INTERVAL = 3000; // Generate gold every 5 seconds

// Function to add gold for each player
function generateGold() {
  for (let player of gameState.players) {
    player.gold += 10; // Adjust the amount of gold generated
  }
  updateUI();
}

// Set up gold generation timer
setInterval(generateGold, GOLD_INTERVAL);
loadImages(); // Load the images

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Check for unit or tower clicks
  for (let player of gameState.players) {
    for (let unit of player.units) {
      if (isClickedOn(mouseX, mouseY, unit)) {
        draggedUnit = unit;
        unit.startDrag();
        break;
      }
    }
    for (let defense of player.defenses) {
      if (isClickedOn(mouseX, mouseY, defense)) {
        draggedTower = defense;
        defense.startDrag();
        break;
      }
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (draggedUnit) {
    // Dragging logic for units
    if (draggedUnit.canMove === false) {
      draggedUnit.x = mouseX;
      draggedUnit.y = mouseY;
    }
  }

  if (draggedTower) {
    // Dragging logic for towers
    if (draggedTower.path === null) {
      draggedTower.x = mouseX;
      draggedTower.y = mouseY;
    }
  }
});

canvas.addEventListener("mouseup", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;

  if (draggedUnit) {
    // Find closest path *before* stopping the drag
    let closestPath = PATHS.reduce((closest, path) => {
      const distance = Math.abs(mouseY - path.y);
      return distance < Math.abs(mouseY - closest.y) ? path : closest;
    });

    draggedUnit.path = closestPath; // Set the path
    draggedUnit.y = closestPath.y; // Set the final Y position
    draggedUnit.x = draggedUnit.player === 0 ? 100 : GAME_WIDTH - 100; // Set x position
    draggedUnit.stopDrag(mouseY); // Now stop the drag, updates canMove to true
    draggedUnit = null;
  }

  if (draggedTower) {
    let closestPath = PATHS.reduce((closest, path) => {
      const distance = Math.abs(mouseY - path.y);
      return distance < Math.abs(mouseY - closest.y) ? path : closest;
    });
    draggedTower.path = closestPath;
    draggedTower.y = closestPath.y;
    closestPath.towers.push(draggedTower);
    draggedTower.stopDrag(mouseY);
    draggedTower = null;
  }
});

function isClickedOn(mouseX, mouseY, object) {
  return (
    mouseX > object.x - object.width / 2 &&
    mouseX < object.x + object.width / 2 &&
    mouseY > object.y - object.height / 2 &&
    mouseY < object.y + object.height / 2
  );
}
// Start the game loop only *after* the images have loaded (add this to the end of loadImages())
let imagesLoadedCount = 0;
const totalImages =
  Object.keys(IMAGES.units).length + Object.keys(IMAGES.towers).length;
function checkImagesLoaded() {
  imagesLoadedCount++;
  if (imagesLoadedCount === totalImages) {
    initializeDefenses(); // Your existing initialization
    gameLoop(); // Start the game loop
  }
}

for (const type in IMAGES.units) {
  IMAGES.units[type].onload = checkImagesLoaded;
}
for (const type in IMAGES.towers) {
  IMAGES.towers[type].onload = checkImagesLoaded;
}
function aiPlay() {
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
  if (aiPlayer.gold >= BUFFS[randomBuff].cost && !aiPlayer.buffs[randomBuff]) {
    // Don't use the same buff twice while active
    activateBuff(1, randomBuff);
    return;
  }
}
setInterval(aiPlay, AI_DELAY);
// Game loop
function gameLoop() {
  if (gamePaused) {
    return; // Do nothing if game is paused
  }
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw paths
  PATHS.forEach((path) => {
    ctx.beginPath();
    ctx.moveTo(0, path.y);
    ctx.lineTo(GAME_WIDTH, path.y);
    ctx.strokeStyle = "#666";
    ctx.setLineDash([5, 15]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

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
    ctx.fillRect(GAME_WIDTH - 100, GAME_HEIGHT / 2 - 150, 128, 128);
  }
  if (IMAGES.mainTower.complete) {
    ctx.drawImage(IMAGES.mainTower, 0, GAME_HEIGHT / 2 - 80, 128, 128);
  } else {
    // Placeholder (optional)
    ctx.fillStyle = "gray";
    ctx.fillRect(GAME_WIDTH - 100, GAME_HEIGHT / 2 - 150, 128, 128);
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
  if (gameState.players[0].towerHP <= 0 || gameState.players[1].towerHP <= 0) {
    const winner = gameState.players[0].towerHP <= 0 ? "Player 2" : "Player 1";
    document.getElementById("winner-text").textContent = `${winner} Wins!`;
    document.getElementById("game-over").style.display = "block";
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Restart game function
function restartGame() {
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
  gamePaused = true;
  document.getElementById("pause-button").textContent = "Pause";
  gameLoop();
}
PATHS.forEach((path) => (path.towers = []));
// Start the game
initializeDefenses();
gameLoop();

