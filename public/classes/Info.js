import constants from '../constants.js';

export default class Info extends PIXI.Container {
    constructor() {
        super()
        
        this._points = this.initPoints();

        const style1 = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 25,
                fill: 0x65ff1a,
                align: "left",
        });

        const style2 = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 28,
                fill: 0x65ff1a,
                align: "left",
        });

        const style3 = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 50,
                fill: 0xff1c2b,
                fontWeight: "bolder",
                align: "center",
        });

        const style4 = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 40,
                fill: 0xff00ff,
                fontWeight: "bolder",
                align: "center",
        });

        //Generate all texts in the info header, the Game Over and the New Game button 
        this._scoreTitleText = new PIXI.Text("SCORE: ", style1);
        this._livesTitleText = new PIXI.Text("LIVES: ", style1);
        this._gameOverText = new PIXI.Text("GAME OVER", style3);
        this._newGameText = new PIXI.Text("NEW GAME", style4);
        this._pointsText20 = new PIXI.Text("20", style1);
        this._pointsText50 = new PIXI.Text("50", style1);

        //Create the New Game button
        this._playAgainButton = new PIXI.Graphics();
        this._playAgainButton.lineStyle(2, 0xFF00FF, 1);
        this._playAgainButton.beginFill(0x2414FF);
        this._playAgainButton.drawRoundedRect(180, 280, 240, 50, 16);
        this._playAgainButton.endFill();
        this._playAgainButton.interactive = true;
        this._playAgainButton.buttonMode = true;
        // this._playAgainButton.on('pointerdown', onButtonDown)

        this._gameOverText.visible = false;
        this._newGameText.visible = false;
        this._playAgainButton.visible = false;

        this._scoreValue = String(this._points).padStart(5, "0");
        this._scoreValueText = new PIXI.Text(this._scoreValue, style2)
        
        //Position the texts
        this._scoreTitleText.position.set(20, 8);
        this._scoreValueText.position.set(120, 6);
        this._livesTitleText.position.set(400, 8);
        this._gameOverText.position.set((constants.GAME_WIDTH / 2) - this._gameOverText.width / 2, 150)
        this._newGameText.position.set((constants.GAME_WIDTH / 2) - this._newGameText.width / 2, 283)
        this._pointsText20.position.set(250, 8)
        this._pointsText50.position.set(320, 8)

        this.initLiveIcons();
        this.initPointsIcons();

        this.addChild(this._scoreTitleText,
                      this._livesTitleText,
                      this._scoreValueText,
                      this._gameOverText,
                      this._pointsText20,
                      this._pointsText50,
                      this._playAgainButton,
                      this._newGameText)
    }
    
    initLiveIcons() {
        const texture = PIXI.Texture.from(`shooter1.png`);
        this._livesIconsArray = [];
        for (let i = 0; i < 3; i++) {
                this._livesIconsArray[i] = new PIXI.Sprite(texture);
                this._livesIconsArray[i].scale.x = 0.55;
                this._livesIconsArray[i].scale.y = 0.55;
                this._livesIconsArray[i].position.set(485 + i * 35, 5);
                this.addChild(this._livesIconsArray[i]);
        }
    }

    initPointsIcons() {
        const texture20 = PIXI.Texture.from('enemy1-1.png');
        const texture50 = PIXI.Texture.from('enemy2-1.png');

        this.pointsIcon20 = new PIXI.Sprite(texture20);
        this.pointsIcon50 = new PIXI.Sprite(texture50);

        this.pointsIcon20.scale.x = 0.5;
        this.pointsIcon20.scale.y = 0.5;

        this.pointsIcon50.scale.x = 0.5;
        this.pointsIcon50.scale.y = 0.5;

        this.pointsIcon20.position.set(220, 4);
        this.pointsIcon50.position.set(290, 4);

        this.addChild(this.pointsIcon20);
        this.addChild(this.pointsIcon50);
    }

    get playerIsAlive() {
        if (this._livesIconsArray.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    initPoints() {
        this._points = 0;
        return this._points;
    }

    updatePoints(value) {
        if (value) {
                this._points += value;
        } else this._points = 0;
        this.showPoints(this._points);
    }

    gameOver() {
        setTimeout(() => {
            this._gameOverText.visible = true;
            this._newGameText.visible = true;
            this._playAgainButton.visible = true;
        }, 500)
    }

    startNewGame() {
        this._gameOverText.visible = false;
        this._newGameText.visible = false;
        this._playAgainButton.visible = false;
        this.updatePoints();
        this.initLiveIcons();
    }

    showPoints(value) {
        this._scoreValue = String(value).padStart(5, "0");
        this._scoreValueText.text = this._scoreValue;
    }

    oneLiveLess() {
        this.removeChild(this._livesIconsArray[this._livesIconsArray.length - 1])
        this._livesIconsArray.pop();
        if (!this.playerIsAlive) {
            this.gameOver()
        }
    }
}