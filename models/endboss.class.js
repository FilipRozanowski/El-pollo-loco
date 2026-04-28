class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 70;
    energy = 100;
    isAlerted = false;
    hasPlayedAlert = false;

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

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HIT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ALERT);
        this.x = 2300;
        this.animate();
    }

    alert() {
        if (this.hasPlayedAlert) return;
        this.hasPlayedAlert = true;
        this.isAlerted = true;

        let alertDuration = this.IMAGES_ALERT.length * 200;
        setTimeout(() => {
            this.isAlerted = false;
            this.startWalking();
        }, alertDuration);
    }

    startWalking() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead()) {
                this.x -= 3;
            }
        }, 1000 / 60);
    }

    animate() {
    setInterval(() => {
        if (this.isDying) return;
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HIT);
        } else if (this.isAlerted) {
            this.playAnimation(this.IMAGES_ALERT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 200);
}

    hit() {
    this.energy -= 20;
    if (this.energy <= 0) {
        this.energy = 0;
        this.die();
    }
    this.lastHit = new Date().getTime();
}

  die() {
    if (this.isDying) return;
    this.isDying = true;
    clearInterval(this.moveInterval);
    
    let frame = 0;
    let deathAnimation = setInterval(() => {
        if (frame < this.IMAGES_DEAD.length) {
            let path = this.IMAGES_DEAD[frame];
            this.img = this.imageCache[path];
            frame++;
        } else {
            clearInterval(deathAnimation);
        }
    }, 200);

    // Nach Animation nach unten fallen, dann Callback
    setTimeout(() => {
        let fallInterval = setInterval(() => {
            this.y += 10;
            if (this.y > 600) { // ← aus dem Bild gefallen
                clearInterval(fallInterval);
                if (this.onDeath) this.onDeath(); // ← Callback aufrufen
            }
        }, 1000 / 60);
    }, this.IMAGES_DEAD.length * 200);
}
}