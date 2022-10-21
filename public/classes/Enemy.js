export default class Enemy extends PIXI.Container {
    constructor(x, y, player) {
        super()
        this.position.set(x, y);
        
        this._enemyType = Math.round(Math.random()) + 1;
        this._speed = (this._enemyType === 1) ? 0.2 : 0.4;
        this._points = (this._enemyType === 1) ? 20 : 50;
        this._hitsPlayer = false;
        
        this.playerX = Math.round(player.x);
        this.playerY = Math.round(player.y);
        this.playerWidth = Math.round(player.width);
        this.playerHeight = Math.round(player.height);

        this._framesArr = [];

        for (let i = 1; i <= 8; i++) {
            const texture = PIXI.Texture.from(`enemy${this._enemyType}-${i}.png`);
            this._framesArr.push(texture);
        };

        this._enemyWalks = new PIXI.AnimatedSprite(this._framesArr);

        this._enemyWalks.anchor.set(0.5, 0.5);
        this._enemyWalks.loop = true;
        this._enemyWalks.animationSpeed = 0.1;
        this._enemyWalks.play();
        
        this.addChild(this._enemyWalks);

        PIXI.Ticker.shared.add(this.onTick, this);
    }
      
    get hitsPlayer() {
        return this._hitsPlayer;
    }

    get points() {
        return this._points;
    }
    
    updatePlayerCoords(valueX, valueY) {
        this.playerX = Math.round(valueX);
        this.playerY = Math.round(valueY);
    }

    onTick() {
        this.x += this._speed * Math.sin(this.angle * Math.PI / 180);
        this.y -= this._speed * Math.cos(this.angle * Math.PI / 180);
    
        if (Math.round(this.x) >= this.playerX &&
            Math.round(this.x) <= this.playerX + 30 &&
            Math.round(this.y) >= this.playerY &&
            Math.round(this.y) <= this.playerY + 30) {
            this._hitsPlayer = true;
        }
    }   
}