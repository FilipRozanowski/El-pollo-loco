class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;


    /**
     * Creates a Cloud at the given x position using the given image.
     * @param {string} imagePath
     * @param {number} x
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }


    /**
     * Starts the cloud movement interval, moving it left continuously.
     */
    animate() {
        setInterval(() => this.moveLeft(), 1000 / 30);
    }
}