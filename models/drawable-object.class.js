class DrawableObject {
    x = 50;
    y = 280;
    img;
    imageCache = {};
    currentImage = 0;
    height = 150;
    width = 100;


    /**
     * Loads a single image from the given path and sets it as the current image.
     * @param {string} path
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


    /**
     * Draws the current image onto the canvas context.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
     * Placeholder for debug frame drawing (currently disabled).
     * @param {CanvasRenderingContext2D} ctx
     */
    drawFrame(ctx) {}
}