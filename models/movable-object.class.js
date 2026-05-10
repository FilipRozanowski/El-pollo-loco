class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };


    /**
     * Moves the object to the right by its speed.
     */
    moveRight() {
        this.x += this.speed;
    }


    /**
     * Moves the object to the left by its speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }


    /**
     * Makes the object jump by setting its vertical speed.
     */
    jump() {
        this.speedY = 25;
        this.currentImage = 0;
    }


    /**
     * Reduces energy by 20 and records the time of the hit.
     */
    hit() {
        this.energy = Math.max(0, this.energy - 20);
        this.lastHit = new Date().getTime();
    }


    /**
     * Returns true if the object was hit within the last 0.5 seconds.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 0.5;
    }


    /**
     * Returns true if the object has no energy left.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }


    /**
     * Triggers the death state by stopping all intervals and playing the dead animation.
     */
    die() {
        this.isDying = true;
        clearInterval(this.animationInterval);
        clearInterval(this.moveInterval);
        clearInterval(this.jumpInterval);
        this.currentImage = 0;
        this.playAnimation(this.IMAGES_DEAD);
    }


    /**
     * Returns true if this object is colliding with another movable object.
     * @param {MovableObject} mo
     * @returns {boolean}
     */
    isColliding(mo) {
        let withinX = this.x + this.width - this.offset.right > mo.x + mo.offset.left
            && this.x + this.offset.left < mo.x + mo.width - mo.offset.right;
        let withinY = this.y + this.height - this.offset.bottom > mo.y + mo.offset.top
            && this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
        return withinX && withinY;
    }


    /**
     * Plays the next frame of an animation, cycling through all images.
     * @param {string[]} images
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }


    /**
     * Plays an animation once and stops on the last frame.
     * @param {string[]} images
     */
    playAnimationOnce(images) {
        let i = Math.min(this.currentImage, images.length - 1);
        this.img = this.imageCache[images[i]];
        if (this.currentImage < images.length - 1) this.currentImage++;
    }


    /**
     * Applies gravity to the object by reducing speedY over time.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }


    /**
     * Returns true if the object is above its ground level.
     * Throwable objects are always considered above ground.
     * @returns {boolean}
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) return true;
        return this.y < 140;
    }
}