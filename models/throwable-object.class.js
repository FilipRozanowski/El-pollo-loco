class ThrowableObject extends MovableObject {

    constructor(x, y, otherDirection = false) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 70;
        this.otherDirection = otherDirection;
        this.throw();
    }

    throw() {
        this.speedY = 25;
        this.applyGravity();
        setInterval(() => {
            this.x += this.otherDirection ? -10 : 10;
        }, 20);
    }

}