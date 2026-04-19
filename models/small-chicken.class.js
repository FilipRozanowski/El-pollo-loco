class SmallChicken extends MovableObject {

    y = 380;
    height = 60;
    width = 60;
     groundLevel = 380;
     offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
};

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ]

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 300 + Math.random() * 2000;
        this.speed = 0.25 + Math.random() * 0.5;

        this.animate();
        this.applyGravity();
    }

     isAboveGround() {
        return this.y < this.groundLevel;
    }



    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200)

        setInterval(() => {
            this.moveLeft();
            if (!this.isAboveGround()) {
                this.jump();
            }
        }, 1000 / 60);

    }
}