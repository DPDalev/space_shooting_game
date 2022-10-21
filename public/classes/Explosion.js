export default class Explosion extends PIXI.Container {
    constructor(x, y) {
        super()
        this.position.set(x, y);

        this._framesArr = [];

        for (let i = 1; i <= 38; i++) {
            const texture = PIXI.Texture.from(`explosion${i}.png`);
            this._framesArr.push(texture);
        }

        this._explosion = new PIXI.AnimatedSprite(this._framesArr);

        this._explosion.anchor.set(0.5, 0.5);
        this._explosion.loop = false;
        this._explosion.animationSpeed = 1;
        this._explosion.play();
        
        this.addChild(this._explosion)
    }
}
