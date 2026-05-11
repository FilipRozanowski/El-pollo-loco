class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 70;
    energy = 100;
    isAlerted = false;
    hasPlayedAlert = false;

    PATROL_RIGHT_LIMIT = 2300;
    PATROL_LEFT_LIMIT  = 100;
    patrolDirection    = -1;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_HIT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];


    /**
     * Creates the Endboss and starts its animation loop.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HIT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ALERT);
        this.x = this.PATROL_RIGHT_LIMIT;
        this.animate();
    }


    /**
     * Triggers the alert animation once, then starts patrolling.
     */
    alert() {
        if (this.hasPlayedAlert) return;
        this.hasPlayedAlert = true;
        this.isAlerted = true;
        setTimeout(() => {
            this.isAlerted = false;
            this.startPatrol();
        }, this.IMAGES_ALERT.length * 200);
    }


    /**
     * Starts the patrol interval – boss walks left to character spawn,
     * then turns around and walks back to its start position, repeating until dead.
     */
    startPatrol() {
        this.moveInterval = setInterval(() => {
            if (this.isDead()) return;
            this.x += this.patrolDirection * 3;
            this.otherDirection = this.patrolDirection > 0;

            if (this.x <= this.PATROL_LEFT_LIMIT) {
                this.patrolDirection = 1;
            } else if (this.x >= this.PATROL_RIGHT_LIMIT) {
                this.patrolDirection = -1;
            }
        }, 1000 / 60);
    }


    /**
     * Starts the animation loop, choosing frames based on current state.
     */
    animate() {
        setInterval(() => {
            if (this.isDying) return;
            this.playCurrentStateAnimation();
        }, 200);
    }


    /**
     * Plays the correct animation for the current boss state.
     */
    playCurrentStateAnimation() {
        if (this.isHurt()) this.playAnimation(this.IMAGES_HIT);
        else if (this.isAlerted) this.playAnimation(this.IMAGES_ALERT);
        else this.playAnimation(this.IMAGES_WALKING);
    }


    /**
     * Reduces boss energy by 20 and triggers death if energy reaches zero.
     */
    hit() {
        this.energy = Math.max(0, this.energy - 20);
        this.lastHit = new Date().getTime();
        if (this.energy === 0) this.die();
    }


    /**
     * Triggers the death sequence: plays death animation then makes boss fall offscreen.
     */
    die() {
        if (this.isDying) return;
        this.isDying = true;
        clearInterval(this.moveInterval);
        this.playDeathAnimation();
        setTimeout(() => this.startDeathFall(), this.IMAGES_DEAD.length * 200);
    }


    /**
     * Plays the death animation frame by frame.
     */
    playDeathAnimation() {
        let frame = 0;
        let deathInterval = setInterval(() => {
            if (frame < this.IMAGES_DEAD.length) {
                this.img = this.imageCache[this.IMAGES_DEAD[frame]];
                frame++;
            } else {
                clearInterval(deathInterval);
            }
        }, 200);
    }


    /**
     * Makes the boss fall downward off screen, then triggers the onDeath callback.
     */
    startDeathFall() {
        let fallInterval = setInterval(() => {
            this.y += 10;
            if (this.y > 600) {
                clearInterval(fallInterval);
                if (this.onDeath) this.onDeath();
            }
        }, 1000 / 60);
    }
}