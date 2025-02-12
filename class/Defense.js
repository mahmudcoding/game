import { ctx, DEFENSES, IMAGES } from "../constants/constants.js";
export class Defense {
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
