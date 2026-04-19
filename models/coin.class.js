class Coin extends MovableObject{
     y = 150;
    width = 150;
    height = 150;
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];
     offset = {
        top: 50,   
        bottom: 50,
        left: 50,
        right: 50
    };


    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);
         this.x = 200 + Math.random() * 2000;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 500);
    }
}