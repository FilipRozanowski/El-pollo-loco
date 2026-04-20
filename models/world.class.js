class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    healthBar = new StatusBar('health', 0, -10);
    coinBar = new StatusBar('coin', 0, 30);
    bottleBar = new StatusBar('bottle', 0, 80);
    throwableObjects = [new ThrowableObject()];



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
        }, 50);

        setInterval(() => {
            this.checkThrowObjects();
        }, 10);

    }

    checkThrowObjects() {
        if (this.keyboard.F && !this.lastThrow && this.bottleBar.percentage >= 20) { // ✅ Mindestens 20 prüfen
            this.lastThrow = true;
            this.bottleBar.setPercentage(this.bottleBar.percentage - 20); // ✅ 20 abziehen
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
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isColliding(enemy) && !enemy.isDying) {

                let characterFeet = this.character.y + this.character.height - this.character.offset.bottom;
                let enemyTop = enemy.y + enemy.offset.top;

                if (this.character.speedY < 0 && characterFeet < enemyTop + 60) { 
                    this.character.speedY = 20;
                    enemy.die();
                    setTimeout(() => {
                        this.level.enemies.splice(index, 1);
                    }, 500);
                } else if (!this.character.isHurt()) {
                    this.character.hit();
                    this.healthBar.setPercentage(this.character.energy);
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


        this.throwableObjects.forEach((bottle, index) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.splashing) {
                    bottle.splash(this, index, enemy);
                }
            });
        });


    }

    draw() {
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