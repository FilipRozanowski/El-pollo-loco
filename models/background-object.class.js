class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;


    /**
     * Creates a BackgroundObject at the given x position using the given image.
     * @param {string} imagePath
     * @param {number} x
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}