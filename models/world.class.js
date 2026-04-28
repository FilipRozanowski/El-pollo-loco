class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    bossVisible = false;
    endbossBar = new StatusBar('endboss', 500, -10);
    healthBar = new StatusBar('health', 0, -10);
    coinBar = new StatusBar('coin', 0, 30);
    bottleBar = new StatusBar('bottle', 0, 80);
    throwableObjects = [];
    endscreen = new Endscreen();
    gameOver = false;
    gameEnded = false;



    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkBossVisibility();
        }, 50);

        setInterval(() => {
            this.checkThrowObjects();
        }, 10);

    }

    checkBossVisibility() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss && boss.x + this.camera_x < this.canvas.width) {
            this.bossVisible = true;
            boss.alert();
        }
    }

    checkThrowObjects() {
        const now = Date.now();
        if (this.keyboard.F && this.bottleBar.percentage >= 20 && (!this.lastThrowTime || now - this.lastThrowTime >= 1000)) {
            this.lastThrowTime = now;
            this.bottleBar.setPercentage(this.bottleBar.percentage - 20);
            let bottle = new ThrowableObject(
                this.character.x + 40,
                this.character.y + this.character.height / 2,
                this.character.otherDirection
            );
            this.throwableObjects.push(bottle);
        }

        if (!this.keyboard.F) {
            this.lastThrow = false;
        }
    }



   checkCollisions() {
    let killedByJump = false;

    this.level.enemies.forEach((enemy, index) => {
        if (this.character.isColliding(enemy) && !enemy.isDying) {

            let characterFeet = this.character.y + this.character.height - this.character.offset.bottom;
            let enemyCenter = enemy.y + enemy.height / 2;

            if (this.character.speedY < 0 && characterFeet < enemyCenter && !(enemy instanceof Endboss)) {
                this.character.speedY = 20;
                 this.character.jumpCurrentImage = 0;
    this.character.jumpingUp = true;     
                enemy.die();
                killedByJump = true;
                this.character.lastHit = new Date().getTime() - 1001;
                setTimeout(() => {
                    const i = this.level.enemies.indexOf(enemy);
                    if (i !== -1) {
                        this.level.enemies.splice(i, 1);
                    }
                }, 500);
                return;
            }

            if (!this.character.isHurt() && !killedByJump) {
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
                if (this.character.isDead() && !this.gameOver) {
                    this.gameOver = true;
                    setTimeout(() => {
                        this.gameEnded = true;
                        this.endscreen.show(this.ctx, this.canvas, 'lose');
                    }, 1000);
                }
            }
        }
    });

    this.level.coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
            this.coinBar.setPercentage(this.coinBar.percentage + 20);
            this.level.coins.splice(index, 1);
        }
    });

    this.level.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle) && this.bottleBar.percentage < 100) {
            this.bottleBar.setPercentage(this.bottleBar.percentage + 20);
            this.level.bottles.splice(index, 1);
        }
    });

    this.throwableObjects.forEach((bottle) => {
        this.level.enemies.forEach((enemy) => {
            if (bottle.isColliding(enemy) && !bottle.splashing) {
                bottle.splash(this, enemy);
                if (enemy instanceof Endboss) {
                    this.endbossBar.setPercentage(enemy.energy);
                    if (enemy.energy <= 0 && !this.gameOver) {
                        this.gameOver = true;
                        enemy.onDeath = () => {
                            this.gameEnded = true;
                            this.endscreen.show(this.ctx, this.canvas, 'won');
                        };
                    }
                }
            }
        });
    });
}

    draw() {
        if (this.gameEnded) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);



        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);

        if (this.bossVisible) {
            this.addToMap(this.endbossBar);
        }

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}