class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];


    /**
     * Creates a throwable bottle at the given position.
     * @param {number} x
     * @param {number} y
     * @param {boolean} otherDirection
     */
    constructor(x, y, otherDirection = false) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 70;
        this.otherDirection = otherDirection;
        this.throw();
    }


    /**
     * Starts the throw: applies gravity, moves horizontally and plays rotation animation.
     */
    throw() {
        this.speedY = 18;
        this.applyGravity();
        this.startMoveInterval();
        this.startRotationAnimation();
    }


    /**
     * Starts the horizontal movement interval for the bottle.
     */
    startMoveInterval() {
        this.throwInterval = setInterval(() => {
            this.x += this.otherDirection ? -10 : 10;
        }, 20);
    }


    /**
     * Starts the rotation animation interval for the bottle.
     */
    startRotationAnimation() {
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 50);
    }


    /**
     * Stops all movement and animation intervals of the bottle.
     */
    stopBottleIntervals() {
        clearInterval(this.throwInterval);
        clearInterval(this.animationInterval);
    }


    /**
     * Triggers the splash effect and handles enemy damage on impact.
     * @param {World} world
     * @param {MovableObject} enemy
     */
    splash(world, enemy) {
        this.splashing = true;
        this.stopBottleIntervals();
        this.currentImage = 0;
        this.applyBottleHit(world, enemy);
        this.playSplashAnimation(world);
    }


    /**
     * Applies damage to the enemy hit by the bottle.
     * @param {World} world
     * @param {MovableObject} enemy
     */
    applyBottleHit(world, enemy) {
        if (!enemy || enemy.isDying) return;
        if (enemy instanceof Endboss) {
            enemy.hit();
        } else {
            enemy.die();
            this.scheduleEnemyRemoval(world, enemy);
        }
    }


    /**
     * Schedules removal of a defeated enemy from the level.
     * @param {World} world
     * @param {MovableObject} enemy
     */
    scheduleEnemyRemoval(world, enemy) {
        setTimeout(() => {
            const i = world.level.enemies.indexOf(enemy);
            if (i !== -1) world.level.enemies.splice(i, 1);
        }, 500);
    }


    /**
     * Plays the splash animation frame by frame, then removes the bottle.
     * @param {World} world
     */
    playSplashAnimation(world) {
        let splashFrame = 0;
        let splashInterval = setInterval(() => {
            if (splashFrame < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[splashFrame]];
                splashFrame++;
            } else {
                clearInterval(splashInterval);
                this.removeFromWorld(world);
            }
        }, 50);
    }


    /**
     * Removes this bottle from the world's throwable objects array.
     * @param {World} world
     */
    removeFromWorld(world) {
        const i = world.throwableObjects.indexOf(this);
        if (i !== -1) world.throwableObjects.splice(i, 1);
    }
}