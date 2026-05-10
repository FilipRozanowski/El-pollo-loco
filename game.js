let canvas;
let world;
let level1;
let keyboard = new Keyboard();
let menuOpen = false;
let impressumScrollY = 0;
let soundManager = new SoundManager();

let menuImage = new Image();
menuImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';

const LINE_HEIGHT = 22;
const BOX_X = 40, BOX_Y = 60, BOX_W = 640, BOX_H = 400;
const CONTENT_TOP = BOX_Y + 50;
const VISIBLE_HEIGHT = BOX_H - 60;

const IMPRESSUM_LINES = [
    { text: 'Angaben gemäß 5 DDG', color: 'white' },
    { text: 'Filip Rozanowski', color: 'white' },
    { text: 'Rauschenberg 15', color: 'white' },
    { text: '59469 Ense', color: 'white' },
    { text: '', color: 'white' },
    { text: 'Vertreten durch: Filip Rozanowski', color: 'white' },
    { text: '', color: 'white' },
    { text: 'Kontakt:', color: '#f5c518' },
    { text: 'Telefon: 0163-6703249', color: 'white' },
    { text: 'E-Mail: filip.rozanowski@gmail.com', color: '#f5c518' },
    { text: '', color: 'white' },
    { text: 'Haftungsausschluss:', color: '#f5c518' },
    { text: 'Icons and Images: Pixabay, Flaticon', color: 'white' },
    { text: 'Sounds: freesound', color: 'white' },
    { text: '', color: 'white' },
    { text: 'Haftung für Inhalte:', color: '#f5c518' },
    { text: 'Die Inhalte wurden mit größter Sorgfalt erstellt.', color: 'white' },
    { text: 'Für Richtigkeit und Vollständigkeit kann keine', color: 'white' },
    { text: 'Gewähr übernommen werden.', color: 'white' },
    { text: '', color: 'white' },
    { text: 'Urheberrecht:', color: '#f5c518' },
    { text: 'Alle Inhalte unterliegen dem deutschen Urheberrecht.', color: 'white' },
    { text: 'Vervielfältigung nur mit schriftl. Zustimmung', color: 'white' },
    { text: 'des jeweiligen Autors.', color: 'white' },
    { text: '', color: 'white' },
    { text: 'Datenschutz:', color: '#f5c518' },
    { text: 'Datenübertragung im Internet kann', color: 'white' },
    { text: 'Sicherheitslücken aufweisen. Ein lückenloser', color: 'white' },
    { text: 'Schutz vor Datenzugriff Dritter ist nicht möglich.', color: 'white' },
];

const TOTAL_CONTENT_HEIGHT = IMPRESSUM_LINES.length * LINE_HEIGHT;
const MAX_SCROLL = Math.max(0, TOTAL_CONTENT_HEIGHT - VISIBLE_HEIGHT);


/**
 * Initializes the game by getting the canvas and drawing the main menu.
 */
function init() {
    canvas = document.getElementById('canvas');
    drawMainMenu();
    initMobileControls();
}


/**
 * Returns the scaled mouse coordinates relative to the canvas.
 * @param {MouseEvent} event
 * @returns {{ x: number, y: number }}
 */
function getCanvasCoords(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
    };
}


/**
 * Checks whether given coordinates are inside a rectangular area.
 * @param {number} x
 * @param {number} y
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {boolean}
 */
function isInside(x, y, x1, y1, x2, y2) {
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}


/**
 * Draws a filled rounded rectangle on the given canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 */
function roundRect(ctx, x, y, width, height, radius) {
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


/**
 * Clears the canvas and redraws the background menu image.
 * @param {CanvasRenderingContext2D} ctx
 */
function clearAndDrawBackground(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
}


/**
 * Adds all event listeners needed for the main menu.
 */
function addMenuListeners() {
    canvas.addEventListener('click', handleMenuClick);
    canvas.addEventListener('click', handleHamburgerClick);
    canvas.addEventListener('mousemove', handleMenuHover);
    canvas.addEventListener('mousemove', handleHamburgerHover);
    canvas.addEventListener('wheel', handleImpressumScroll, { passive: true });
}


/**
 * Removes all event listeners used by the main menu.
 */
function removeMenuListeners() {
    canvas.removeEventListener('click', handleMenuClick);
    canvas.removeEventListener('click', handleHamburgerClick);
    canvas.removeEventListener('mousemove', handleMenuHover);
    canvas.removeEventListener('mousemove', handleHamburgerHover);
    canvas.removeEventListener('wheel', handleImpressumScroll);
}


/**
 * Draws the main menu screen and registers its event listeners.
 */
function drawMainMenu() {
    let ctx = canvas.getContext('2d');
    menuOpen = false;
    impressumScrollY = 0;
    hideMobileControls();

    const render = () => {
        clearAndDrawBackground(ctx);
        drawMenuButtons(ctx, false, false);
        drawHamburgerIcon(ctx, false);
        addMenuListeners();
    };

    if (menuImage.complete) render();
    else menuImage.onload = render;
}


/**
 * Draws a single menu button with optional hover state.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {string} label
 * @param {boolean} hovered
 */
function drawSingleButton(ctx, x, y, label, hovered) {
    ctx.fillStyle = hovered ? '#ffd700' : '#f5c518';
    ctx.shadowColor = hovered ? 'rgba(255,215,0,0.6)' : 'transparent';
    ctx.shadowBlur = hovered ? 12 : 0;
    roundRect(ctx, x, y, 150, 45, 8);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Zabra';
    ctx.letterSpacing = '2px';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 75, y + 29);
}


/**
 * Draws both main menu buttons (Start Game and How to Play).
 * @param {CanvasRenderingContext2D} ctx
 * @param {boolean} hoverStart
 * @param {boolean} hoverHow
 */
function drawMenuButtons(ctx, hoverStart = false, hoverHow = false) {
    drawSingleButton(ctx, 210, 60, 'Start Game', hoverStart);
    drawSingleButton(ctx, 380, 60, 'How to Play', hoverHow);
}


/**
 * Draws the hamburger / close icon in the top-right corner.
 * @param {CanvasRenderingContext2D} ctx
 * @param {boolean} isOpen
 */
function drawHamburgerIcon(ctx, isOpen) {
    const cx = 695, cy = 35, size = 18;
    ctx.save();
    drawHamburgerBackground(ctx, cx, cy);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    if (isOpen) drawCloseLines(ctx, cx, cy, size);
    else drawHamburgerLines(ctx, cx, cy, size);
    ctx.restore();
}


/**
 * Draws the circular background for the hamburger icon.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 */
function drawHamburgerBackground(ctx, cx, cy) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();
}


/**
 * Draws the X (close) lines for the hamburger icon.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} size
 */
function drawCloseLines(ctx, cx, cy, size) {
    ctx.beginPath();
    ctx.moveTo(cx - size / 2 + 3, cy - size / 2 + 3);
    ctx.lineTo(cx + size / 2 - 3, cy + size / 2 - 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + size / 2 - 3, cy - size / 2 + 3);
    ctx.lineTo(cx - size / 2 + 3, cy + size / 2 - 3);
    ctx.stroke();
}


/**
 * Draws three horizontal lines for the hamburger icon.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} size
 */
function drawHamburgerLines(ctx, cx, cy, size) {
    [-6, 0, 6].forEach(offset => {
        ctx.beginPath();
        ctx.moveTo(cx - size / 2, cy + offset);
        ctx.lineTo(cx + size / 2, cy + offset);
        ctx.stroke();
    });
}


/**
 * Draws the impressum overlay box including title, scrollable text and scrollbar.
 * @param {CanvasRenderingContext2D} ctx
 */
function drawImpressum(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    roundRect(ctx, BOX_X, BOX_Y, BOX_W, BOX_H, 12);
    drawImpressumTitle(ctx);
    drawImpressumText(ctx);
    if (MAX_SCROLL > 0) drawScrollbar(ctx);
    ctx.restore();
}


/**
 * Draws the title of the impressum box.
 * @param {CanvasRenderingContext2D} ctx
 */
function drawImpressumTitle(ctx) {
    ctx.fillStyle = '#f5c518';
    ctx.font = 'bold 24px Zabra';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('Impressum', 360, BOX_Y + 35);
}


/**
 * Draws the scrollable text content of the impressum.
 * @param {CanvasRenderingContext2D} ctx
 */
function drawImpressumText(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(BOX_X + 10, CONTENT_TOP, BOX_W - 30, VISIBLE_HEIGHT);
    ctx.clip();
    ctx.font = '14px Zabra';
    ctx.letterSpacing = '1px';
    IMPRESSUM_LINES.forEach((line, i) => {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 360, CONTENT_TOP + 15 + i * LINE_HEIGHT - impressumScrollY);
    });
    ctx.restore();
}


/**
 * Draws the scrollbar for the impressum overlay.
 * @param {CanvasRenderingContext2D} ctx
 */
function drawScrollbar(ctx) {
    const scrollbarX = BOX_X + BOX_W - 14;
    const scrollbarH = VISIBLE_HEIGHT;
    const scrollbarY = CONTENT_TOP;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(scrollbarX, scrollbarY, 8, scrollbarH, 4);
    ctx.fill();
    drawScrollbarThumb(ctx, scrollbarX, scrollbarY, scrollbarH);
}


/**
 * Draws the thumb (draggable part) of the impressum scrollbar.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} scrollbarX
 * @param {number} scrollbarY
 * @param {number} scrollbarH
 */
function drawScrollbarThumb(ctx, scrollbarX, scrollbarY, scrollbarH) {
    const thumbH = Math.max(30, (VISIBLE_HEIGHT / TOTAL_CONTENT_HEIGHT) * scrollbarH);
    const thumbY = scrollbarY + (impressumScrollY / MAX_SCROLL) * (scrollbarH - thumbH);
    ctx.fillStyle = '#f5c518';
    ctx.beginPath();
    ctx.roundRect(scrollbarX, thumbY, 8, thumbH, 4);
    ctx.fill();
}


/**
 * Redraws the full menu canvas (background, buttons, optional impressum, hamburger).
 * @param {CanvasRenderingContext2D} ctx
 */
function redrawMenu(ctx) {
    clearAndDrawBackground(ctx);
    drawMenuButtons(ctx, false, false);
    if (menuOpen) drawImpressum(ctx);
    drawHamburgerIcon(ctx, menuOpen);
}


/**
 * Handles mouse hover on the main menu to highlight buttons.
 * @param {MouseEvent} event
 */
function handleMenuHover(event) {
    let { x, y } = getCanvasCoords(event);
    let hoverStart = isInside(x, y, 210, 60, 360, 105);
    let hoverHow = isInside(x, y, 380, 60, 530, 105);
    let ctx = canvas.getContext('2d');
    clearAndDrawBackground(ctx);
    drawMenuButtons(ctx, hoverStart, hoverHow);
    if (menuOpen) drawImpressum(ctx);
    drawHamburgerIcon(ctx, menuOpen);
    canvas.style.cursor = (hoverStart || hoverHow) ? 'pointer' : 'default';
}


/**
 * Handles mouse hover over the hamburger icon.
 * @param {MouseEvent} event
 */
function handleHamburgerHover(event) {
    let { x, y } = getCanvasCoords(event);
    if (isInside(x, y, 675, 15, 715, 55)) canvas.style.cursor = 'pointer';
}


/**
 * Handles click on the hamburger icon to toggle the impressum.
 * @param {MouseEvent} event
 */
function handleHamburgerClick(event) {
    let { x, y } = getCanvasCoords(event);
    if (!isInside(x, y, 675, 15, 715, 55)) return;
    menuOpen = !menuOpen;
    impressumScrollY = 0;
    redrawMenu(canvas.getContext('2d'));
}


/**
 * Handles scroll wheel input to scroll the impressum content.
 * @param {WheelEvent} event
 */
function handleImpressumScroll(event) {
    if (!menuOpen) return;
    impressumScrollY += event.deltaY * 0.5;
    impressumScrollY = Math.max(0, Math.min(MAX_SCROLL, impressumScrollY));
    redrawMenu(canvas.getContext('2d'));
}


/**
 * Handles clicks on the main menu buttons (Start Game / How to Play).
 * @param {MouseEvent} event
 */
function handleMenuClick(event) {
    let { x, y } = getCanvasCoords(event);
    if (isInside(x, y, 210, 60, 360, 105)) {
        removeMenuListeners();
        startGame();
    }
    if (isInside(x, y, 380, 60, 530, 105)) {
        removeMenuListeners();
        showHowToPlay();
    }
}


/**
 * Starts the game by initializing the level, world and music.
 */
function startGame() {
    showMobileControls();
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.cursor = 'default';
    level1 = createLevel1();
    world = new World(canvas, keyboard);
    soundManager.startMusic();
}


/**
 * Draws the "How to Play" screen with an optional hover state on the back button.
 * @param {boolean} hoverBack
 */
function showHowToPlay(hoverBack = false) {
    let ctx = canvas.getContext('2d');
    clearAndDrawBackground(ctx);
    drawHowToPlayBox(ctx);
    drawHowToPlayText(ctx);
    drawHowToPlayBackButton(ctx, hoverBack);
    canvas.addEventListener('click', handleHowToPlayBack);
    canvas.addEventListener('mousemove', handleHowToPlayHover);
}


/**
 * Draws the dark background box for the How to Play overlay.
 * @param {CanvasRenderingContext2D} ctx
 */
function drawHowToPlayBox(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    roundRect(ctx, 150, 80, 420, 280, 12);
}


/**
 * Draws the instructions text inside the How to Play overlay.
 * @param {CanvasRenderingContext2D} ctx
 */
function drawHowToPlayText(ctx) {
    ctx.letterSpacing = '2px';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f5c518';
    ctx.font = 'bold 26px Zabra';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText('How to Play', 360, 120);
    ctx.fillStyle = 'white';
    ctx.font = '20px Zabra';
    ctx.fillText('⬅ A  /  D ➡   –   Bewegen', 360, 165);
    ctx.fillText('SPACE   –   Springen', 360, 200);
    ctx.fillText('F   –   Flasche werfen', 360, 235);
    ctx.fillText('Auf Hühner springen um sie zu töten!', 360, 270);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}


/**
 * Draws the back button on the How to Play screen.
 * @param {CanvasRenderingContext2D} ctx
 * @param {boolean} hovered
 */
function drawHowToPlayBackButton(ctx, hovered) {
    ctx.fillStyle = hovered ? '#ffd700' : '#f5c518';
    ctx.shadowColor = hovered ? 'rgba(255,215,0,0.6)' : 'transparent';
    ctx.shadowBlur = hovered ? 12 : 0;
    roundRect(ctx, 285, 295, 150, 42, 8);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'black';
    ctx.font = 'bold 18px Zabra';
    ctx.letterSpacing = '2px';
    ctx.textAlign = 'center';
    ctx.fillText('← Zurück', 360, 322);
}


/**
 * Handles mouse hover on the How to Play screen's back button.
 * @param {MouseEvent} event
 */
function handleHowToPlayHover(event) {
    let { x, y } = getCanvasCoords(event);
    let hoverBack = isInside(x, y, 285, 295, 435, 337);
    canvas.style.cursor = hoverBack ? 'pointer' : 'default';
    canvas.removeEventListener('click', handleHowToPlayBack);
    canvas.removeEventListener('mousemove', handleHowToPlayHover);
    showHowToPlay(hoverBack);
}


/**
 * Handles click on the back button of the How to Play screen.
 * @param {MouseEvent} event
 */
function handleHowToPlayBack(event) {
    let { x, y } = getCanvasCoords(event);
    if (!isInside(x, y, 285, 295, 435, 337)) return;
    canvas.removeEventListener('click', handleHowToPlayBack);
    canvas.removeEventListener('mousemove', handleHowToPlayHover);
    canvas.style.cursor = 'default';
    drawMainMenu();
}


// ──────────────────────────────────────────
// Keyboard Events
// ──────────────────────────────────────────

/**
 * Sets the corresponding keyboard state to true on key press.
 * @param {KeyboardEvent} event
 */
window.addEventListener('keydown', (event) => {
    if (event.keyCode == 68) keyboard.RIGHT = true;
    if (event.keyCode == 65) keyboard.LEFT = true;
    if (event.keyCode == 87) keyboard.UP = true;
    if (event.keyCode == 83) keyboard.DOWN = true;
    if (event.keyCode == 32) keyboard.SPACE = true;
    if (event.keyCode == 70) keyboard.F = true;
});


/**
 * Sets the corresponding keyboard state to false on key release.
 * @param {KeyboardEvent} event
 */
window.addEventListener('keyup', (event) => {
    if (event.keyCode == 68) keyboard.RIGHT = false;
    if (event.keyCode == 65) keyboard.LEFT = false;
    if (event.keyCode == 87) keyboard.UP = false;
    if (event.keyCode == 83) keyboard.DOWN = false;
    if (event.keyCode == 32) keyboard.SPACE = false;
    if (event.keyCode == 70) keyboard.F = false;
});


// ──────────────────────────────────────────
// Mobile Controls
// ──────────────────────────────────────────

/**
 * Returns true if the current device is a touch device.
 * @returns {boolean}
 */
function isTouchDevice() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}


/**
 * Creates a single touch button and appends it to the given container.
 * @param {string} label
 * @param {string} key
 * @param {string} id
 * @param {HTMLElement} container
 */
function createTouchButton(label, key, id, container) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.textContent = label;
    btn.className = 'mobile-btn';
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard[key] = true; }, { passive: false });
    btn.addEventListener('touchend',   (e) => { e.preventDefault(); keyboard[key] = false; }, { passive: false });
    container.appendChild(btn);
}


/**
 * Creates the left-side control group (move left / move right).
 * @returns {HTMLElement}
 */
function createLeftControls() {
    const group = document.createElement('div');
    group.id = 'controls-left';
    createTouchButton('◀', 'LEFT',  'btn-left',  group);
    createTouchButton('▶', 'RIGHT', 'btn-right', group);
    return group;
}


/**
 * Creates the right-side control group (throw / jump).
 * @returns {HTMLElement}
 */
function createRightControls() {
    const group = document.createElement('div');
    group.id = 'controls-right';
    createTouchButton('🍶', 'F',     'btn-throw', group);
    createTouchButton('⬆',  'SPACE', 'btn-jump',  group);
    return group;
}


/**
 * Positions the mobile controls overlay to match the canvas position on screen.
 * @param {HTMLElement} controls
 */
function positionControls(controls) {
    const rect = canvas.getBoundingClientRect();
    controls.style.position       = 'fixed';
    controls.style.top            = rect.top    + 'px';
    controls.style.left           = rect.left   + 'px';
    controls.style.width          = rect.width  + 'px';
    controls.style.height         = rect.height + 'px';
    controls.style.display        = controls.style.display === 'none' ? 'none' : 'flex';
    controls.style.justifyContent = 'space-between';
    controls.style.alignItems     = 'flex-end';
    controls.style.padding        = '16px';
    controls.style.boxSizing      = 'border-box';
    controls.style.zIndex         = '100';
    controls.style.pointerEvents  = 'none';
}


/**
 * Initializes and injects the mobile touch controls overlay over the canvas.
 * Only runs on touch devices.
 */
function initMobileControls() {
    if (!isTouchDevice()) return;

    const controls = document.createElement('div');
    controls.id = 'mobile-controls';
    controls.style.display = 'none';
    controls.appendChild(createLeftControls());
    controls.appendChild(createRightControls());
    document.body.appendChild(controls);

    setTimeout(() => positionControls(controls), 200);

    window.addEventListener('resize', () => setTimeout(() => positionControls(controls), 100));

    if (screen.orientation) {
        screen.orientation.addEventListener('change', () => setTimeout(() => positionControls(controls), 300));
    }
}


/**
 * Hides the mobile controls overlay.
 */
function hideMobileControls() {
    const controls = document.getElementById('mobile-controls');
    if (controls) controls.style.display = 'none';
}


/**
 * Shows the mobile controls by positioning them over the canvas.
 */
function showMobileControls() {
    if (!isTouchDevice()) return;
    const controls = document.getElementById('mobile-controls');
    if (!controls) return;
    controls.style.display = 'flex';
    positionControls(controls);
}