// ──────────────────────────────────────────
// Helper Utilities
// ──────────────────────────────────────────

/**
 * Clears the canvas and redraws the background menu image.
 * @param {CanvasRenderingContext2D} ctx
 */
function clearAndDrawBackground(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
}


/**
 * Adds a CSS class to a DOM element by ID.
 * @param {string} id
 * @param {string} cls
 */
function showEl(id, cls = 'hidden') {
    document.getElementById(id).classList.remove(cls);
}


/**
 * Removes a CSS class from a DOM element by ID.
 * @param {string} id
 * @param {string} cls
 */
function hideEl(id, cls = 'hidden') {
    document.getElementById(id).classList.add(cls);
}


// ──────────────────────────────────────────
// Main Menu
// ──────────────────────────────────────────

/**
 * Draws the background image on the canvas and shows the main menu overlay.
 */
function drawMainMenu() {
    let ctx = canvas.getContext('2d');
    world = null;
    hideMobileControls();

    showEl('menu-overlay');
    hideEl('impressum-overlay');
    hideEl('howtoplay-overlay');

    const render = () => clearAndDrawBackground(ctx);
    if (menuImage.complete) render();
    else menuImage.onload = render;
}


// ──────────────────────────────────────────
// Menu Button Handlers
// ──────────────────────────────────────────

/**
 * Called when the Start Game button is clicked.
 */
function onStartGame() {
    hideEl('menu-overlay');
    startGame();
}


/**
 * Called when the How to Play button is clicked.
 */
function onHowToPlay() {
    hideEl('menu-overlay');
    showEl('howtoplay-overlay');
}


/**
 * Called when the back button on the How to Play screen is clicked.
 */
function onBackToMenu() {
    hideEl('howtoplay-overlay');
    drawMainMenu();
}


/**
 * Called when the hamburger button is clicked – toggles the impressum overlay.
 */
function onToggleImpressum() {
    const el = document.getElementById('impressum-overlay');
    const btn = document.getElementById('btn-hamburger');
    const isOpen = !el.classList.contains('hidden');
    if (isOpen) {
        hideEl('impressum-overlay');
        btn.innerHTML = '&#9776;';
    } else {
        showEl('impressum-overlay');
        btn.innerHTML = '&#10005;';
    }
}


// ──────────────────────────────────────────
// Endscreen Handlers
// ──────────────────────────────────────────

/**
 * Restarts the game from the endscreen.
 */
function onRestart() {
    document.getElementById('endscreen-lose').classList.add('hidden');
    document.getElementById('endscreen-won').classList.add('hidden');
    soundManager.stopAll();
    level1 = createLevel1();
    world = new World(canvas, keyboard);
    soundManager.startMusic();
    showMobileControls();
}


/**
 * Returns to the main menu from the endscreen.
 */
function onBackToMainMenu() {
    document.getElementById('endscreen-lose').classList.add('hidden');
    document.getElementById('endscreen-won').classList.add('hidden');
    soundManager.stopAll();
    drawMainMenu();
}