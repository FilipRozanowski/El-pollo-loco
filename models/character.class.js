class Character extends MovableObject {

    height = 300;
    width = 150;
    y = 50;
    world;
    speed = 5;
    jumpingUp = false;
    jumpCurrentImage = 0;
    deathAnimationDone = false;
    walkPlaying = false;
    jumpTriggered = false;

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING_UP = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png'
    ];
    IMAGES_JUMPING_DOWN = [
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    offset = {
        top: 120,
        bottom: 10,
        left: 20,
        right: 20
    };

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_JUMPING_UP);
        this.loadImages(this.IMAGES_JUMPING_DOWN);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    jump() {
        this.speedY = 25;
        this.jumpCurrentImage = 0;
        this.jumpingUp = true;
        soundManager.play('jump');
    }

    playJumpAnimation() {
        if (this.speedY > 0) {

            let i = Math.min(this.jumpCurrentImage, this.IMAGES_JUMPING_UP.length - 1);
            this.img = this.imageCache[this.IMAGES_JUMPING_UP[i]];
            if (this.jumpCurrentImage < this.IMAGES_JUMPING_UP.length - 1) this.jumpCurrentImage++;
        } else {

            if (this.jumpingUp) {
                this.jumpCurrentImage = 0;
                this.jumpingUp = false;
            }
            let i = Math.min(this.jumpCurrentImage, this.IMAGES_JUMPING_DOWN.length - 1);
            this.img = this.imageCache[this.IMAGES_JUMPING_DOWN[i]];
            if (this.jumpCurrentImage < this.IMAGES_JUMPING_DOWN.length - 1) this.jumpCurrentImage++;
        }
    }

    animate() {
    setInterval(() => {
         if (this.world.gameEnded) return;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
        this.world.camera_x = -this.x + 100;

         if (this.world.keyboard.SPACE && !this.isAboveGround() && !this.jumpTriggered) {
        this.jumpTriggered = true;  
        this.jump();
    }
    if (!this.world.keyboard.SPACE) {
        this.jumpTriggered = false; 
    }
    }, 1000 / 60);

   setInterval(() => {
     if (this.world.gameEnded) return;

    if (this.isDead()) {
        if (!this.deathAnimationDone) {
            let i = this.currentImage % this.IMAGES_DEAD.length;
            this.img = this.imageCache[this.IMAGES_DEAD[i]];
            this.currentImage++;
            if (this.currentImage >= this.IMAGES_DEAD.length) {
                this.deathAnimationDone = true;
            }
        }
    } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
        this.playJumpAnimation();
    } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
            if (!this.walkPlaying) {
                this.walkPlaying = true;
                soundManager.play('walk');
            }
        } else {
            if (this.walkPlaying) {
                this.walkPlaying = false;
                soundManager.stop('walk');
            }
            this.playAnimation(this.IMAGES_IDLE);
        }
    }
}, 100);
}

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = new Date().getTime();
        soundManager.play('hit');
        this.knockback();
    }

    knockback() {
        let knockbackDirection = this.otherDirection ? 1 : -1;
        let knockbackDistance = 30;
        let steps = 0;

        let knockbackInterval = setInterval(() => {
            this.x += knockbackDirection * 30;
            this.speedY = steps === 0 ? 10 : this.speedY;
            steps++;
            if (steps >= knockbackDistance / 5) {
                clearInterval(knockbackInterval);
            }
        }, 1000 / 60);
    }
}