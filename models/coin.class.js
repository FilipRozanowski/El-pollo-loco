class Coin extends MovableObject {
    y = 150;
    width = 150;
    height = 150;
    offset = { top: 50, bottom: 50, left: 50, right: 50 };

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];


    /**
     * Creates a Coin at a random x position and starts its animation.
     */
    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);
        this.x = 200 + Math.random() * 2000;
        this.animate();
    }


    /**
     * Starts the coin flip animation interval.
     */
    animate() {
        setInterval(() => this.playAnimation(this.IMAGES_COIN), 500);
    }
}