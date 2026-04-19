class Bottle extends MovableObject{

    y = 350;
    height = 100;

     offset = {
        top: 50,   
        bottom: 50,
        left: 50,
        right: 50
    };



    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = 200 + Math.random() * 2000;

    }

}