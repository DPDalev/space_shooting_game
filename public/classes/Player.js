import constants from "../constants.js";

export default class Player extends PIXI.Container {
    constructor() {
        super()
        this.initPosition();
        
        this._framesArr = [];
        
        for (let i = 1; i <= 8; i++) {
            const texture = PIXI.Texture.from(`shooter${i}.png`);
            this._framesArr.push(texture);
        }
        
        this._playerWalks = new PIXI.AnimatedSprite(this._framesArr);
        
        this._playerWalks.anchor.set(0.5, 0.5);
        this._playerWalks.loop = true;
        this._playerWalks.animationSpeed = 0.1;
        this._playerWalks.stop();
        this._speed = 0;
        
        this.addChild(this._playerWalks);

        PIXI.Ticker.shared.add(this.onTick, this);
    }

    initPosition() {
        this.position.set(constants.GAME_WIDTH / 2, constants.GAME_HEIGHT / 2);
    }

    walks() {
        this._playerWalks.play();
        this._speed = 1.0;
    }

    stops() {
        this._playerWalks.stop();
        this._speed = 0;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    onTick() {
        this.x += this._speed * Math.sin(this.angle * Math.PI / 180);
        if (this.x < 32) this.x = 32;
        if (this.x > 568) this.x = 568;
        
        this.y -= this._speed * Math.cos(this.angle * Math.PI / 180);
        if (this.y < 70) this.y = 70;
        if (this.y > 468) this.y = 468;
    }
}