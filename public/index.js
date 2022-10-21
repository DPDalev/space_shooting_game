import Info from './classes/Info.js';
import Player from './classes/Player.js';
import Enemy from './classes/Enemy.js';
import Rocket from './classes/Rocket.js';
import Explosion from './classes/Explosion.js';
import constants from './constants.js';


const app = new PIXI.Application({
    width: constants.GAME_WIDTH,
    height: constants.GAME_HEIGHT,
    backgroundColor: 0x2980b9,
});

document.body.appendChild(app.view);

const loadAssets = () => {
    const loader = PIXI.Loader.shared;
    loader.add("enemy1Sheet", "../assets/enemy1/enemy1Sheet.json");
    loader.add("enemy2Sheet", "../assets/enemy2/enemy2Sheet.json");
    loader.add("shooterSheet", "../assets/shooter/shooterSheet.json");
    loader.add("rocketSheet", "../assets/rocket/rocketSheet.json");
    loader.add("explosionSheet", "../assets/explosion/explosionSheet.json");
    loader.onComplete.once(() => {
        startGame();
    });
    loader.load();
}

window.onload = () => {
    loadAssets();
}

const generateRandomNumber = (lowerLimit, upperLimit) => {
    let randomNumber = Math.random() * upperLimit + lowerLimit;
    return randomNumber;
}

const generateEnemy = () => {
        let randomPositionX = generateRandomNumber(100, constants.GAME_WIDTH - 100);
        let randomPositionY = generateRandomNumber(100, constants.GAME_HEIGHT - 100);
        let enemy = new Enemy(randomPositionX, randomPositionY, player);
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        enemy.angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;

        enemies.push(enemy);        
        app.stage.addChild(enemy);
        return enemy;
}

const collision = (pointX, pointY, sprite) => {
    if (pointX >= sprite.position.x &&
        pointX <= sprite.position.x + sprite.width &&
        pointY >= sprite.position.y &&
        pointY <= sprite.position.y + sprite.height) {
            return true;
    } else {
        return false;
    }
}

const clearArray = (arr) => {
    arr.map(element => {
        app.stage.removeChild(element);
    });
}

//Prevents right click to open context menu
window.addEventListener("contextmenu", event => event.preventDefault());

let player, generateEnemyID, generateRocketID;
let enemies = [];
let rockets = [];

const generateEnemies = () => {
     //Generate first enemy
     let n = Math.round(Math.random() * 4) + 4;
     let i = 0;
     generateEnemy();
 
     //Generate more enemies after (4, 8) seconds
     generateEnemyID = setInterval(() => {
         i++;
         if (i === n) {
             n = Math.round(Math.random() * 4) + 4;
                 generateEnemy();
             i = 0;
         };
     }, 1000);
}

//Random enemy shoots rocket
const generateRockets = () => {
    generateRocketID = setInterval(() => {
        if (enemies.length > 0) {
            let randomEnemyIndex = Math.round(Math.random() * (enemies.length - 1));
            let randomEnemy = enemies[randomEnemyIndex];
            let rocket = new Rocket(randomEnemy.x, randomEnemy.y, randomEnemy.angle, player);

            rockets.push(rocket);
            rocket.show();
            app.stage.addChild(rocket);
        }
    }, 3000);
}

const restartGame = () => {
    enemies = [];
    rockets = [];

    //Generate the player
    player = new Player();
    app.stage.addChild(player);
    // player.show();
    // player.initPosition();
    generateEnemies();
    generateRockets();
}

const startGame = () => {

    //Check whether any rocket hits the player
    const checkRocket = () => {
        rockets.map(rocket => {
            if (rocket.isOut) {
                rockets.splice(rockets.indexOf(rocket), 1)
                app.stage.removeChild(rocket);
            };
    
            if (rocket.hitsPlayer) {
                rockets.splice(rockets.indexOf(rocket), 1)
                app.stage.removeChild(rocket);
    
                let explosion = new Explosion(player.x, player.y);
                app.stage.addChild(explosion);
                setTimeout(() => {
                    app.stage.removeChild(explosion);
                }, 1000)
                
                player.hide();
                info.oneLiveLess();

                if (info.playerIsAlive) {
                    setTimeout(() => {
                        player.show();
                    }, 700);
                } else {
                    app.stage.removeChild(player);
                    clearArray(enemies);
                    clearArray(rockets);
                    clearInterval(generateEnemyID);
                    clearInterval(generateRocketID);
                };
            };
        });
    }

    //Check whether any enemy reaches the player
    const checkEnemy = () => {
        enemies.map(enemy => {
    
            if (enemy.hitsPlayer) {
                enemies.splice(enemies.indexOf(enemy), 1)
                app.stage.removeChild(enemy);
    
                let explosion = new Explosion(player.x, player.y);
                app.stage.addChild(explosion);
                setTimeout(() => {
                    app.stage.removeChild(explosion);
                }, 1000)
                
                player.hide();
                info.oneLiveLess();

                if (info.playerIsAlive) {
                    setTimeout(() => {
                        player.show();
                    }, 700);
                } else {
                    app.stage.removeChild(player);
                    clearArray(enemies);
                    clearArray(rockets);
                    clearInterval(generateEnemyID);
                    clearInterval(generateRocketID);
                };
            };
        });
    }

    PIXI.Ticker.shared.add(checkRocket);
    PIXI.Ticker.shared.add(checkEnemy);

    //Generate Info header
    const info = new Info();
    app.stage.addChild(info);
    
    //Generate the player
    player = new Player();
    app.stage.addChild(player);
    
    generateEnemies();
    generateRockets();

    //Mouse pointer position
    let mouseX, mouseY;

    //The player rotates towards the mouse pointer
    document.body.addEventListener("mousemove", event => {
        let dx = event.clientX - player.x;
        let dy = event.clientY - player.y;
        player.angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    });

    //The player shoots and walks
    document.body.addEventListener("mousedown", event => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!info.playerIsAlive) {
            document.body.removeEventListener("mousedown", () => {});
            info.startNewGame();
            restartGame();
        } else {

        //The player shoots
        if (event.button === 0) {
            let laser = new PIXI.Graphics();

            laser.position.set(player.position.x, player.position.y)
            laser.lineStyle(1, 0xfffb11)
            laser.lineTo(mouseX - player.position.x, mouseY - player.position.y);

            app.stage.addChild(laser);

            setTimeout(() => {
                app.stage.removeChild(laser)
            }, 100)
                        
            enemies.map(enemy => {
                if (collision(mouseX, mouseY, enemy)) {
                    let explosion = new Explosion(enemy.x, enemy.y);
                    app.stage.addChild(explosion);

                    setTimeout(() => {
                        app.stage.removeChild(explosion)
                    }, 1000)

                    info.updatePoints(enemy.points);
                    enemies.splice(enemies.indexOf(enemy), 1);

                    app.stage.removeChild(enemy);
                };
            });

        //The player walks        
        } else if (event.button === 2) {
            player.walks();
            setInterval(() => {
                enemies.map(enemy => {
                    let dx = player.x - enemy.x;
                    let dy = player.y - enemy.y;
                    enemy.angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
                    enemy.updatePlayerCoords(player.x, player.y);
                });
                rockets.map(rocket => {
                    rocket.updatePlayerCoords(player.x, player.y);
                });
            }, 0);
        };
    };
});

    //The player stops
    document.body.addEventListener("mouseup", event => {
        if (event.button === 2) {
            player.stops();
        };
    });
}
