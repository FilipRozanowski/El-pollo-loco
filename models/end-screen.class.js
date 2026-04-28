class Endscreen {

    IMAGES_WON = 'img/You won, you lost/You won A.png';
    IMAGES_LOSE = 'img/You won, you lost/Game Over.png';

   show(ctx, canvas, type) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let img = new Image();
    img.src = type === 'won' ? this.IMAGES_WON : this.IMAGES_LOSE;
    img.onload = () => {
        let imgWidth = 500;
        let imgHeight = 300;
        let x = (canvas.width - imgWidth) / 2;
        let y = (canvas.height - imgHeight) / 2;
        ctx.drawImage(img, x, y, imgWidth, imgHeight);
    };
}
}