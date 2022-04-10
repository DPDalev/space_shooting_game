export default  class Rocket extends PIXI.Container {
    constructor(x, y, angle, player) {
        super()
        this.position.set(x, y);

        this.angle = angle;
        
        this.playerX = Math.round(player.x);
        this.playerY = Math.round(player.y);
        this.playerWidth = Math.round(player.width);
        this.playerHeight = Math.round(player.height);

        this._hitsPlayer = false;

        this._framesArr = [];

        for (let i = 1; i <= 4; i++) {
            const texture = PIXI.Texture.from(`rocket${i}.png`);
            this._framesArr.push(texture);
        };

        this._rocket = new PIXI.AnimatedSprite(this._framesArr);
            
        this._rocket.anchor.set(0.5, 0.5);
        this._rocket.loop = true;
        this._rocket.animationSpeed = 0.04;
        this._rocket.scale.set(0.6);
        this._rocket.play();
        this._speed = 1.5;

        this._isOut = false;

        // For GSAP -> equal speed regardles of the position
        // this.rocketPath = Math.round(Math.sqrt(Math.pow((player.x - this.x), 2) + Math.pow((player.y - this.y), 2)))
        // this.rocketTime = this.rocketPath / 100;

        this.addChild(this._rocket);
      
        PIXI.Ticker.shared.add(this.onTick, this);
    }
    
    get hitsPlayer() {
        return this._hitsPlayer;
    }

    get isOut() {
        return this._isOut;
    }

    launch() {
        this._speed = 1;
    }

    updatePlayerCoords(valueX, valueY) {
        this.playerX = Math.round(valueX);
        this.playerY = Math.round(valueY);
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    onTick() {
        this.x += this._speed * Math.sin(this.angle * Math.PI / 180);
        this.y -= this._speed * Math.cos(this.angle * Math.PI / 180);

        if (this.x < 0 || this.x > 600 || this.y > 500 || this.y < 0) {
            this._isOut = true;
        }

        if (Math.round(this.x) >= this.playerX &&
            Math.round(this.x) <= this.playerX + 30 &&
            Math.round(this.y) >= this.playerY &&
            Math.round(this.y) <= this.playerY + 30) {
            this._hitsPlayer = true;
        }
    }
}
