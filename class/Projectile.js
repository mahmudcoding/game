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
