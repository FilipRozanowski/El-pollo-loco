class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    bossVisible = false;
    endbossBar = new StatusBar('endboss', 510, 10);
    healthBar = new StatusBar('health', 0, -10);
    coinBar = new StatusBar('coin', 0, 30);
    bottleBar = new StatusBar('bottle', 0, 80);
    throwableObjects = [];
    endscreen = new Endscreen();
    gameOver = false;
    gameEnded = false;


    /**
     * Creates the World instance, sets up canvas context, drawing, collisions and mute button.
     * @param {HTMLCanvasElement} canvas
     * @param {Keyboard} keyboard
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.endbossBar.x = canvas.width - 210;
        this.endbossBar.y = -10;
        this.endbossBar.width = 210;
        this.endbossBar.height = 60;
        this.draw();
        this.setWorld();
        this.run();
        this.registerMuteButton(canvas);
    }


    /**
     * Registers the mute button click handler on the canvas.
     * @param {HTMLCanvasElement} canvas
     */
    registerMuteButton(canvas) {
        if (canvas._muteHandler) canvas.removeEventListener('click', canvas._muteHandler);
        canvas._muteHandler = (e) => this.handleMuteClick(e);
        canvas.addEventListener('click', canvas._muteHandler);
    }


    /**
     * Handles a click on the mute button area.
     * @param {MouseEvent} e
     */
    handleMuteClick(e) {
        let { x, y } = this.getCanvasCoords(e);
        const bx = this.canvas.width - 50;
        const by = 75;
        if (Math.hypot(x - bx, y - by) <= 18) soundManager.toggleMute();
    }


    /**
     * Returns the scaled canvas coordinates for a mouse event.
     * @param {MouseEvent} e
     * @returns {{ x: number, y: number }}
     */
    getCanvasCoords(e) {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        let scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }


    /**
     * Assigns this world instance to the character.
     */
    setWorld() {
        this.character.world = this;
    }


    /**
     * Starts the collision and throw check intervals.
     */
    run() {
        this.collisionInterval = setInterval(() => {
            this.checkCollisions();
            this.checkBossVisibility();
        }, 50);
        this.throwInterval = setInterval(() => this.checkThrowObjects(), 10);
    }


    /**
     * Clears all running game intervals.
     */
    stopIntervals() {
        clearInterval(this.collisionInterval);
        clearInterval(this.throwInterval);
    }


    /**
     * Checks if the endboss has entered the visible screen area.
     */
    checkBossVisibility() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss && boss.x + this.camera_x < this.canvas.width) {
            this.bossVisible = true;
            boss.alert();
        }
    }


    /**
     * Checks whether the player can throw a bottle and spawns one if so.
     */
    checkThrowObjects() {
        const now = Date.now();
        const canThrow = this.keyboard.F
            && this.bottleBar.percentage >= 20
            && (!this.lastThrowTime || now - this.lastThrowTime >= 1000);

        if (canThrow) {
            this.spawnBottle();
            this.lastThrowTime = now;
        }

        if (!this.keyboard.F) this.lastThrow = false;
    }


    /**
     * Spawns a new throwable bottle at the character's current position.
     */
    spawnBottle() {
        this.bottleBar.setPercentage(this.bottleBar.percentage - 20);
        let bottle = new ThrowableObject(
            this.character.x + 40,
            this.character.y + this.character.height / 2,
            this.character.otherDirection
        );
        this.throwableObjects.push(bottle);
    }


    /**
     * Runs all collision checks for enemies, coins, bottles and throwable objects.
     */
    checkCollisions() {
        let killedByJump = false;
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isColliding(enemy) || enemy.isDying) return;
            killedByJump = this.checkEnemyCollision(enemy, killedByJump);
        });
        this.checkCoinCollisions();
        this.checkBottlePickupCollisions();
        this.checkThrowableCollisions();
    }


    /**
     * Handles collision between the character and a single enemy.
     * @param {MovableObject} enemy
     * @param {boolean} killedByJump
     * @returns {boolean} updated killedByJump state
     */
    checkEnemyCollision(enemy, killedByJump) {
        let characterFeet = this.character.y + this.character.height - this.character.offset.bottom;
        let enemyCenter = enemy.y + enemy.height / 2;
        let jumpKill = this.character.speedY < 0
            && characterFeet < enemyCenter
            && !(enemy instanceof Endboss);

        if (jumpKill) {
            this.killEnemyByJump(enemy);
            return true;
        }

        if (!this.character.isHurt() && !killedByJump) this.applyEnemyDamage();
        return killedByJump;
    }


    /**
     * Kills an enemy by jumping on it and bounces the character upward.
     * @param {MovableObject} enemy
     */
    killEnemyByJump(enemy) {
        this.character.speedY = 20;
        this.character.jumpCurrentImage = 0;
        this.character.jumpingUp = true;
        this.character.lastHit = new Date().getTime() - 1001;
        enemy.die();
        soundManager.play('chicken');
        setTimeout(() => {
            const i = this.level.enemies.indexOf(enemy);
            if (i !== -1) this.level.enemies.splice(i, 1);
        }, 500);
    }


    /**
     * Applies damage to the character and checks for death.
     */
    applyEnemyDamage() {
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
        if (this.character.isDead() && !this.gameOver) this.triggerLose();
    }


    /**
     * Triggers the lose state after a short delay.
     */
    triggerLose() {
        this.gameOver = true;
        setTimeout(() => {
            this.gameEnded = true;
            this.stopIntervals();
            soundManager.stopAll();
            soundManager.play('lose');
            this.canvas._endType = 'lose';
            this.canvas._bgSnapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.endscreen.show(this.ctx, this.canvas, 'lose');
        }, 900);
    }


    /**
     * Checks collisions between the character and collectible coins.
     */
    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coinBar.setPercentage(this.coinBar.percentage + 20);
                this.level.coins.splice(index, 1);
            }
        });
    }


    /**
     * Checks collisions between the character and collectible bottles.
     */
    checkBottlePickupCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle) && this.bottleBar.percentage < 100) {
                this.bottleBar.setPercentage(this.bottleBar.percentage + 20);
                this.level.bottles.splice(index, 1);
            }
        });
    }


    /**
     * Checks collisions between thrown bottles and enemies.
     */
    checkThrowableCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.splashing) {
                    bottle.splash(this, enemy);
                    if (enemy instanceof Endboss) this.handleEndbossHit(enemy);
                }
            });
        });
    }


    /**
     * Handles a bottle hit on the endboss and checks for win condition.
     * @param {Endboss} enemy
     */
    handleEndbossHit(enemy) {
        soundManager.play('boss');
        this.endbossBar.setPercentage(enemy.energy);
        if (enemy.energy <= 0 && !this.gameOver) {
            this.gameOver = true;
            enemy.onDeath = () => this.triggerWin();
        }
    }


    /**
     * Triggers the win state when the endboss is defeated.
     */
    triggerWin() {
        this.gameEnded = true;
        this.stopIntervals();
        soundManager.stopAll();
        soundManager.play('win');
        this.canvas._endType = 'won';
        this.canvas._bgSnapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.endscreen.show(this.ctx, this.canvas, 'won');
    }


    /**
     * Main draw loop – clears canvas and redraws all game objects each frame.
     */
    draw() {
        if (this.gameEnded) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWorldObjects();
        this.drawHudElements();
        requestAnimationFrame(() => this.draw());
    }


    /**
     * Draws all world objects (background, clouds, items, character, enemies).
     */
    drawWorldObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }


    /**
     * Draws all HUD elements (health, coin, bottle bars, endboss bar, mute button).
     */
    drawHudElements() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.bossVisible) this.addToMap(this.endbossBar);
        this.drawMuteButton();
    }


    /**
     * Draws the mute/unmute button below the endboss health bar.
     */
    drawMuteButton() {
        const x = this.canvas.width - 50;
        const y = 75;
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(soundManager.muted ? '🔇' : '🔊', x, y);
        this.ctx.restore();
    }


    /**
     * Draws all objects in an array onto the canvas.
     * @param {MovableObject[]} objects
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }


    /**
     * Draws a single movable object, flipping it if facing left.
     * @param {MovableObject} mo
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }


    /**
     * Flips the canvas context horizontally to draw a mirrored object.
     * @param {MovableObject} mo
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }


    /**
     * Restores the canvas context after flipping.
     * @param {MovableObject} mo
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}