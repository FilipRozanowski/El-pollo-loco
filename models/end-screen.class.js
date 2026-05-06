class Endscreen {

    IMAGES_WON = 'img/You won, you lost/You won A.png';
    IMAGES_LOSE = 'img/You won, you lost/Game Over.png';

    show(ctx, canvas, type) {
        let img = new Image();
        img.src = type === 'won' ? this.IMAGES_WON : this.IMAGES_LOSE;

        const draw = () => {
            let imgWidth = 500, imgHeight = 300;
            let x = (canvas.width - imgWidth) / 2;
            let y = 40;
            if (canvas._bgSnapshot) ctx.putImageData(canvas._bgSnapshot, 0, 0);
            ctx.drawImage(img, x, y, imgWidth, imgHeight);
            this.drawButtons(ctx, canvas, false, false);
            canvas.addEventListener('click', this._clickHandler = (e) => this.handleClick(e, canvas));
            canvas.addEventListener('mousemove', this._hoverHandler = (e) => this.handleHover(e, ctx, canvas, img));
        };

        if (img.complete) draw();
        else img.onload = draw;
    }

    drawButtons(ctx, canvas, hoverRestart, hoverBack) {
        const btnW = 180, btnH = 40, btnX = canvas.width / 2 - 90;
        const restartY = 345, backY = 405;

        // Restart Button
        ctx.fillStyle = hoverRestart ? '#ffd700' : '#f5c518';
        ctx.shadowColor = hoverRestart ? 'rgba(255,215,0,0.6)' : 'transparent';
        ctx.shadowBlur = hoverRestart ? 12 : 0;
        this.roundRect(ctx, btnX, restartY, btnW, btnH, 8);
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'black';
        ctx.font = 'bold 18px Zabra';
        ctx.letterSpacing = '2px';
        ctx.textAlign = 'center';
        ctx.fillText('Restart', canvas.width / 2, restartY + 27);

        // Back to Startscreen Button
        ctx.fillStyle = hoverBack ? '#ffd700' : '#f5c518';
        ctx.shadowColor = hoverBack ? 'rgba(255,215,0,0.6)' : 'transparent';
        ctx.shadowBlur = hoverBack ? 12 : 0;
        this.roundRect(ctx, btnX, backY, btnW, btnH, 8);
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'black';
        ctx.font = 'bold 18px Zabra';
        ctx.letterSpacing = '2px';
        ctx.fillText('Back to Startscreen', canvas.width / 2, backY + 27);
    }

    handleHover(event, ctx, canvas, img) {
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        let x = (event.clientX - rect.left) * scaleX;
        let y = (event.clientY - rect.top) * scaleY;

        const btnW = 180, btnX = canvas.width / 2 - 90;
        const hoverRestart = x >= btnX && x <= btnX + btnW && y >= 345 && y <= 385;
        const hoverBack    = x >= btnX && x <= btnX + btnW && y >= 405 && y <= 445;

        canvas.style.cursor = (hoverRestart || hoverBack) ? 'pointer' : 'default';

        let imgWidth = 500, imgHeight = 300;
        let ix = (canvas.width - imgWidth) / 2;
        if (canvas._bgSnapshot) ctx.putImageData(canvas._bgSnapshot, 0, 0);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, ix, 40, imgWidth, imgHeight);
        this.drawButtons(ctx, canvas, hoverRestart, hoverBack);
    }

    handleClick(event, canvas) {
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        let x = (event.clientX - rect.left) * scaleX;
        let y = (event.clientY - rect.top) * scaleY;

        const btnW = 180, btnX = canvas.width / 2 - 90;

        if (x >= btnX && x <= btnX + btnW && y >= 345 && y <= 385) {
            this.cleanup(canvas);
            soundManager.stopAll();
            level1 = createLevel1();
            world = new World(canvas, keyboard);
             soundManager.startMusic();
        }

        if (x >= btnX && x <= btnX + btnW && y >= 405 && y <= 445) {
            this.cleanup(canvas);
             soundManager.stopAll();
            drawMainMenu();
        }
    }

    cleanup(canvas) {
        canvas.removeEventListener('click', this._clickHandler);
        canvas.removeEventListener('mousemove', this._hoverHandler);

         if (canvas._muteHandler) {
        canvas.removeEventListener('click', canvas._muteHandler);
        canvas._muteHandler = null;
    }

        canvas.style.cursor = 'default';
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
}