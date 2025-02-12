export const UNITS = {
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
export const DEFENSES = {
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
export const BUFFS = {
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

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 600;
export const TOWER_WIDTH = 100;
export const TOWER_HEIGHT = 200;
export const UNIT_SIZE = 30;
export const WALL_WIDTH = 30;
export const WALL_HEIGHT = 80;
export const AI_ENABLED = true;
export const AI_DELAY = 1000;

export const IMAGES = {
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