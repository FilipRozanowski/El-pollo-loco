class Endscreen {

    IMAGES_WON  = 'img/You won, you lost/You won A.png';
    IMAGES_LOSE = 'img/You won, you lost/Game Over.png';

    BTN_W = 180;
    BTN_H = 40;
    RESTART_Y = 345;
    BACK_Y = 405;


    /**
     * Shows the end screen overlay with result image and action buttons.
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvas
     * @param {'won'|'lose'} type
     */
    show(ctx, canvas, type) {
        let img = new Image();
        img.src = type === 'won' ? this.IMAGES_WON : this.IMAGES_LOSE;
        const draw = () => {
            this.drawEndscreen(ctx, canvas, img);
            this.registerListeners(canvas, ctx, img);
        };
        if (img.complete) draw();
        else img.onload = draw;
    }


    /**
     * Draws the result image and buttons onto the canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvas
     * @param {HTMLImageElement} img
     */
    drawEndscreen(ctx, canvas, img) {
        if (canvas._bgSnapshot) ctx.putImageData(canvas._bgSnapshot, 0, 0);
        ctx.drawImage(img, (canvas.width - 500) / 2, 40, 500, 300);
        this.drawButtons(ctx, canvas, false, false);
    }


    /**
     * Registers click and hover event listeners for the end screen.
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLImageElement} img
     */
    registerListeners(canvas, ctx, img) {
        canvas.addEventListener('click', this._clickHandler = (e) => this.handleClick(e, canvas));
        canvas.addEventListener('mousemove', this._hoverHandler = (e) => this.handleHover(e, ctx, canvas, img));
    }


    /**
     * Returns the scaled canvas coordinates for a mouse event.
     * @param {MouseEvent} event
     * @param {HTMLCanvasElement} canvas
     * @returns {{ x: number, y: number }}
     */
    getCanvasCoords(event, canvas) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * (canvas.width / rect.width),
            y: (event.clientY - rect.top) * (canvas.height / rect.height),
        };
    }


    /**
     * Returns the x position of the centered button.
     * @param {HTMLCanvasElement} canvas
     * @returns {number}
     */
    getBtnX(canvas) {
        return canvas.width / 2 - this.BTN_W / 2;
    }


    /**
     * Draws a single button with optional hover highlight.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @param {string} label
     * @param {boolean} hovered
     */
    drawButton(ctx, x, y, label, hovered) {
        ctx.fillStyle = hovered ? '#ffd700' : '#f5c518';
        ctx.shadowColor = hovered ? 'rgba(255,215,0,0.6)' : 'transparent';
        ctx.shadowBlur = hovered ? 12 : 0;
        this.roundRect(ctx, x, y, this.BTN_W, this.BTN_H, 8);
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'black';
        ctx.font = 'bold 18px Zabra';
        ctx.letterSpacing = '2px';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + this.BTN_W / 2, y + 27);
    }


    /**
     * Draws both end screen buttons (Restart and Back to Startscreen).
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvas
     * @param {boolean} hoverRestart
     * @param {boolean} hoverBack
     */
    drawButtons(ctx, canvas, hoverRestart, hoverBack) {
        const btnX = this.getBtnX(canvas);
        this.drawButton(ctx, btnX, this.RESTART_Y, 'Restart', hoverRestart);
        this.drawButton(ctx, btnX, this.BACK_Y, 'Back to Startscreen', hoverBack);
    }


    /**
     * Handles mouse hover to highlight buttons and update cursor.
     * @param {MouseEvent} event
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvas
     * @param {HTMLImageElement} img
     */
    handleHover(event, ctx, canvas, img) {
        let { x, y } = this.getCanvasCoords(event, canvas);
        const btnX = this.getBtnX(canvas);
        const hoverRestart = x >= btnX && x <= btnX + this.BTN_W && y >= this.RESTART_Y && y <= this.RESTART_Y + this.BTN_H;
        const hoverBack    = x >= btnX && x <= btnX + this.BTN_W && y >= this.BACK_Y    && y <= this.BACK_Y    + this.BTN_H;
        canvas.style.cursor = (hoverRestart || hoverBack) ? 'pointer' : 'default';
        if (canvas._bgSnapshot) ctx.putImageData(canvas._bgSnapshot, 0, 0);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, (canvas.width - 500) / 2, 40, 500, 300);
        this.drawButtons(ctx, canvas, hoverRestart, hoverBack);
    }


    /**
     * Handles click events on the Restart and Back buttons.
     * @param {MouseEvent} event
     * @param {HTMLCanvasElement} canvas
     */
    handleClick(event, canvas) {
        let { x, y } = this.getCanvasCoords(event, canvas);
        const btnX = this.getBtnX(canvas);
        if (x >= btnX && x <= btnX + this.BTN_W && y >= this.RESTART_Y && y <= this.RESTART_Y + this.BTN_H) {
            this.restartGame(canvas);
        }
        if (x >= btnX && x <= btnX + this.BTN_W && y >= this.BACK_Y && y <= this.BACK_Y + this.BTN_H) {
            this.goToMainMenu(canvas);
        }
    }


    /**
     * Restarts the game by creating a new level and world.
     * @param {HTMLCanvasElement} canvas
     */
    restartGame(canvas) {
        this.cleanup(canvas);
        soundManager.stopAll();
        level1 = createLevel1();
        world = new World(canvas, keyboard);
        soundManager.startMusic();
    }


    /**
     * Returns to the main menu and stops all sounds.
     * @param {HTMLCanvasElement} canvas
     */
    goToMainMenu(canvas) {
        this.cleanup(canvas);
        soundManager.stopAll();
        drawMainMenu();
    }


    /**
     * Removes all end screen event listeners and resets the cursor.
     * @param {HTMLCanvasElement} canvas
     */
    cleanup(canvas) {
        canvas.removeEventListener('click', this._clickHandler);
        canvas.removeEventListener('mousemove', this._hoverHandler);
        if (canvas._muteHandler) {
            canvas.removeEventListener('click', canvas._muteHandler);
            canvas._muteHandler = null;
        }
        canvas.style.cursor = 'default';
    }


    /**
     * Draws a filled rounded rectangle on the given context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} radius
     */
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