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

    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            this.x += this.otherDirection ? -10 : 10;
        }, 20);
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 50);
    }

   splash(world, bottleIndex, enemy) {
    this.splashing = true;
    clearInterval(this.throwInterval);
    clearInterval(this.animationInterval);
    
    if (enemy && !enemy.isDying) {
        enemy.die();
        setTimeout(() => {
            const enemyIndex = world.level.enemies.indexOf(enemy);
            if (enemyIndex !== -1) {
                world.level.enemies.splice(enemyIndex, 1);
            }
        }, 500);
    }

    this.currentImage = 0;
    let splashInterval = setInterval(() => {
        this.playAnimation(this.IMAGES_SPLASH);
        if (this.currentImage >= this.IMAGES_SPLASH.length) {
            clearInterval(splashInterval);
            world.throwableObjects.splice(bottleIndex, 1);
        }
    }, 50);
}
}