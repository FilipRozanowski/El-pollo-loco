let canvas;
let world;
let Level1;
let keyboard = new Keyboard();
let menuImage = new Image();
menuImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';

function init() {
    canvas = document.getElementById('canvas');
    drawMainMenu();
}

function drawMainMenu() {
    let ctx = canvas.getContext('2d');

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
        drawMenuButtons(ctx, false, false);
        canvas.addEventListener('click', handleMenuClick);
        canvas.addEventListener('mousemove', handleMenuHover);
    };

    if (menuImage.complete) {
        render();
    } else {
        menuImage.onload = render;
    }
}

function handleMenuHover(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;

    let hoverStart = x >= 210 && x <= 360 && y >= 60 && y <= 105;
    let hoverHow   = x >= 380 && x <= 530 && y >= 60 && y <= 105;

    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
    drawMenuButtons(ctx, hoverStart, hoverHow);

    canvas.style.cursor = (hoverStart || hoverHow) ? 'pointer' : 'default';
}

function drawMenuButtons(ctx, hoverStart = false, hoverHow = false) {
    // "Start Game" Button
    ctx.fillStyle = hoverStart ? '#ffd700' : '#f5c518';
    ctx.shadowColor = hoverStart ? 'rgba(255,215,0,0.6)' : 'transparent';
    ctx.shadowBlur = hoverStart ? 12 : 0;
    roundRect(ctx, 210, 60, 150, 45, 8);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Zabra';
    ctx.letterSpacing = '2px';
    ctx.textAlign = 'center';
    ctx.fillText('Start Game', 285, 89);

    // "How to Play" Button
    ctx.fillStyle = hoverHow ? '#ffd700' : '#f5c518';
    ctx.shadowColor = hoverHow ? 'rgba(255,215,0,0.6)' : 'transparent';
    ctx.shadowBlur = hoverHow ? 12 : 0;
    roundRect(ctx, 380, 60, 150, 45, 8);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Zabra';
    ctx.letterSpacing = '2px';
    ctx.fillText('How to Play', 455, 89);
}

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

function handleMenuClick(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;

    if (x >= 210 && x <= 360 && y >= 60 && y <= 105) {
        canvas.removeEventListener('click', handleMenuClick);
        canvas.removeEventListener('mousemove', handleMenuHover);
        startGame();
    }

    if (x >= 380 && x <= 530 && y >= 60 && y <= 105) {
        canvas.removeEventListener('click', handleMenuClick);
        canvas.removeEventListener('mousemove', handleMenuHover);
        showHowToPlay();
    }
}

function startGame() {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.removeEventListener('mousemove', handleMenuHover);
    canvas.style.cursor = 'default';
    level1 = createLevel1();
    world = new World(canvas, keyboard);
}

function showHowToPlay(hoverBack = false) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);

    // Dunkles Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    roundRect(ctx, 150, 80, 420, 280, 12);

    // Titel
    ctx.letterSpacing = '2px';
    ctx.fillStyle = '#f5c518';
    ctx.font = 'bold 26px Zabra';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText('How to Play', 360, 120);

    // Texte
    ctx.fillStyle = 'white';
    ctx.font = '20px Zabra';
    ctx.letterSpacing = '2px';
    ctx.fillText('⬅ A  /  D ➡   –   Bewegen', 360, 165);
    ctx.fillText('SPACE   –   Springen', 360, 200);
    ctx.fillText('F   –   Flasche werfen', 360, 235);
    ctx.fillText('Auf Hühner springen um sie zu töten!', 360, 270);

    // Schatten zurücksetzen
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Zurück Button mit Hover
    ctx.fillStyle = hoverBack ? '#ffd700' : '#f5c518';
    ctx.shadowColor = hoverBack ? 'rgba(255,215,0,0.6)' : 'transparent';
    ctx.shadowBlur = hoverBack ? 12 : 0;
    roundRect(ctx, 285, 295, 150, 42, 8);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'black';
    ctx.font = 'bold 18px Zabra';
    ctx.letterSpacing = '2px';
    ctx.fillText('← Zurück', 360, 322);

    canvas.addEventListener('click', handleHowToPlayBack);
    canvas.addEventListener('mousemove', handleHowToPlayHover);
}

function handleHowToPlayHover(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;

    let hoverBack = x >= 285 && x <= 435 && y >= 295 && y <= 337;
    canvas.style.cursor = hoverBack ? 'pointer' : 'default';

    canvas.removeEventListener('click', handleHowToPlayBack);
    canvas.removeEventListener('mousemove', handleHowToPlayHover);
    showHowToPlay(hoverBack);
}

function handleHowToPlayBack(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;

    if (x >= 285 && x <= 435 && y >= 295 && y <= 337) {
        canvas.removeEventListener('click', handleHowToPlayBack);
        canvas.removeEventListener('mousemove', handleHowToPlayHover);
        canvas.style.cursor = 'default';
        drawMainMenu();
    }
}


// ──────────────────────────────────────────
// Keyboard Events
// ──────────────────────────────────────────

window.addEventListener('keydown', (event) => {
    if (event.keyCode == 68) keyboard.RIGHT = true;
    if (event.keyCode == 65) keyboard.LEFT = true;
    if (event.keyCode == 87) keyboard.UP = true;
    if (event.keyCode == 83) keyboard.DOWN = true;
    if (event.keyCode == 32) keyboard.SPACE = true;
    if (event.keyCode == 70) keyboard.F = true;
});

window.addEventListener('keyup', (event) => {
    if (event.keyCode == 68) keyboard.RIGHT = false;
    if (event.keyCode == 65) keyboard.LEFT = false;
    if (event.keyCode == 87) keyboard.UP = false;
    if (event.keyCode == 83) keyboard.DOWN = false;
    if (event.keyCode == 32) keyboard.SPACE = false;
    if (event.keyCode == 70) keyboard.F = false;
});