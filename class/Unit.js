import {ctx, UNIT_SIZE,UNITS, IMAGES} from '../constants/constants.js';
export class Unit {
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
    }

    update() {
      // Movement
      if (!this.findTarget()) {
        this.x += this.speed * this.direction;
      }

      // Attack cooldown
      if (this.attackCooldown > 0) {
        this.attackCooldown--;
      }

      // Poison effect
      if (this.poisoned) {
        if (Math.random() < 0.1) {
          this.hp -= 5;
        }
      }

      // Healing effect
      if (gameState.players[this.player].buffs.heal) {
        if (Math.random() < 0.1) {
          this.hp = Math.min(this.maxHP, this.hp + 5);
        }
      }
    }

    findTarget() {
      const enemyPlayer = this.player === 0 ? 1 : 0;

      // Check for enemy units
      for (let unit of gameState.players[enemyPlayer].units) {
        if (this.isInRange(unit)) {
          this.attack(unit);
          return true;
        }
      }

      // Check for enemy defenses
      for (let defense of gameState.players[enemyPlayer].defenses) {
        if (this.isInRange(defense)) {
          this.attack(defense);
          return true;
        }
      }

      // Check enemy tower
      const towerX = enemyPlayer === 0 ? 0 : GAME_WIDTH - TOWER_WIDTH;
      if (Math.abs(this.x - towerX) < this.range + TOWER_WIDTH) {
        this.attackTower(enemyPlayer);
        return true;
      }

      return false;
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
