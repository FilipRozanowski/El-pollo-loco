class SmallChicken extends MovableObject {

    y = 380;
    height = 60;
    width = 60;
    groundLevel = 380;
    offset = { top: -10, bottom: 10, left: 10, right: 10 };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];


    /**
     * Creates a SmallChicken at a random position with a random speed.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 300 + Math.random() * 2000;
        this.speed = 0.25 + Math.random() * 0.5;
        this.animate();
        this.applyGravity();
    }


    /**
     * Returns true if the chicken is above its ground level.
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < this.groundLevel;
    }


    /**
     * Starts all animation and movement intervals for the chicken.
     */
    animate() {
        this.startAnimationInterval();
        this.startMoveInterval();
        this.startJumpInterval();
    }


    /**
     * Starts the animation interval switching between walk and dead frames.
     */
    startAnimationInterval() {
        this.animationInterval = setInterval(() => {
            const images = this.isDying ? this.IMAGES_DEAD : this.IMAGES_WALKING;
            this.playAnimation(images);
        }, 200);
    }


    /**
     * Starts the movement interval moving the chicken left while alive.
     */
    startMoveInterval() {
        this.moveInterval = setInterval(() => {
            if (!this.isDying) this.moveLeft();
        }, 1000 / 60);
    }


    /**
     * Starts the jump interval triggering random jumps while on the ground.
     */
    startJumpInterval() {
        this.jumpInterval = setInterval(() => {
            if (!this.isDying && !this.isAboveGround()) this.jump();
        }, 2000 + Math.random() * 1000);
    }
}