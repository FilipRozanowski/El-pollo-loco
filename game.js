// ──────────────────────────────────────────
// Global State
// ──────────────────────────────────────────

let canvas;
let world;
let level1;
let keyboard = new Keyboard();
let menuOpen = false;
let impressumScrollY = 0;
let soundManager = new SoundManager();

let menuImage = new Image();
menuImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';


// ──────────────────────────────────────────
// Init
// ──────────────────────────────────────────

/**
 * Initializes the game by getting the canvas and drawing the main menu.
 */
function init() {
    canvas = document.getElementById('canvas');
    drawMainMenu();
    initMobileControls();
}


/**
 * Starts the game by initializing the level, world and music.
 */
function startGame() {
    let ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.cursor = 'default';
    level1 = createLevel1();
    world = new World(canvas, keyboard);
    soundManager.startMusic();
    showMobileControls();
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
 * Registers touch events on the static HTML buttons.
 * @param {string} id - Button element ID
 * @param {string} key - Keyboard key to simulate
 */
function registerTouchButton(id, key) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard[key] = true;  }, { passive: false });
    btn.addEventListener('touchend',   (e) => { e.preventDefault(); keyboard[key] = false; }, { passive: false });
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
    controls.style.justifyContent = 'space-between';
    controls.style.alignItems     = 'flex-end';
    controls.style.padding        = '16px';
    controls.style.boxSizing      = 'border-box';
    controls.style.zIndex         = '100';
    controls.style.pointerEvents  = 'none';
}


/**
 * Registers touch listeners on all static mobile buttons and sets up
 * resize/orientation listeners to manage visibility dynamically.
 */
function initMobileControls() {
    registerTouchButton('btn-left',  'LEFT');
    registerTouchButton('btn-right', 'RIGHT');
    registerTouchButton('btn-throw', 'F');
    registerTouchButton('btn-jump',  'SPACE');

    window.addEventListener('resize', () => {
        setTimeout(() => updateMobileControlsVisibility(), 100);
    });

    if (screen.orientation) {
        screen.orientation.addEventListener('change', () => {
            setTimeout(() => updateMobileControlsVisibility(), 300);
        });
    }
}


/**
 * Shows or hides the mobile controls depending on touch device state and game state.
 */
function updateMobileControlsVisibility() {
    const controls = document.getElementById('mobile-controls');
    if (!controls) return;
    const gameActive = typeof world !== 'undefined' && world !== null;
    const shouldShow = isTouchDevice() && gameActive;
    controls.style.display = shouldShow ? 'flex' : 'none';
    if (shouldShow) positionControls(controls);
}


/**
 * Hides the mobile controls overlay.
 */
function hideMobileControls() {
    const controls = document.getElementById('mobile-controls');
    if (controls) controls.style.display = 'none';
}


/**
 * Shows the mobile controls if on a touch device.
 */
function showMobileControls() {
    updateMobileControlsVisibility();
}