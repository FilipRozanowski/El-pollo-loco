let canvas;
let world;
let Level1;
let keyboard = new Keyboard();
let menuImage = new Image();
let menuOpen = false;
let impressumScrollY = 0;
menuImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';

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

const LINE_HEIGHT = 22;
const BOX_X = 40, BOX_Y = 60, BOX_W = 640, BOX_H = 400;
const CONTENT_TOP = BOX_Y + 50;
const VISIBLE_HEIGHT = BOX_H - 60;
const TOTAL_CONTENT_HEIGHT = IMPRESSUM_LINES.length * LINE_HEIGHT;
const MAX_SCROLL = Math.max(0, TOTAL_CONTENT_HEIGHT - VISIBLE_HEIGHT);

function init() {
    canvas = document.getElementById('canvas');
    drawMainMenu();
}

function drawMainMenu() {
    let ctx = canvas.getContext('2d');
    menuOpen = false;
    impressumScrollY = 0;

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
        drawMenuButtons(ctx, false, false);
        drawHamburgerIcon(ctx, false);

        canvas.addEventListener('click', handleMenuClick);
        canvas.addEventListener('click', handleHamburgerClick);
        canvas.addEventListener('mousemove', handleMenuHover);
        canvas.addEventListener('mousemove', handleHamburgerHover);
        canvas.addEventListener('wheel', handleImpressumScroll, { passive: true });
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
    if (menuOpen) drawImpressum(ctx);
    drawHamburgerIcon(ctx, menuOpen);

    canvas.style.cursor = (hoverStart || hoverHow) ? 'pointer' : 'default';
}

function drawMenuButtons(ctx, hoverStart = false, hoverHow = false) {
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

function drawHamburgerIcon(ctx, isOpen) {
    const cx = 695, cy = 35, size = 18;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    if (isOpen) {
        ctx.beginPath();
        ctx.moveTo(cx - size/2 + 3, cy - size/2 + 3);
        ctx.lineTo(cx + size/2 - 3, cy + size/2 - 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + size/2 - 3, cy - size/2 + 3);
        ctx.lineTo(cx - size/2 + 3, cy + size/2 - 3);
        ctx.stroke();
    } else {
        [-6, 0, 6].forEach(offset => {
            ctx.beginPath();
            ctx.moveTo(cx - size/2, cy + offset);
            ctx.lineTo(cx + size/2, cy + offset);
            ctx.stroke();
        });
    }
    ctx.restore();
}

function drawImpressum(ctx) {
    ctx.save();

    // Hintergrund-Box
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    roundRect(ctx, BOX_X, BOX_Y, BOX_W, BOX_H, 12);

    // Titel
    ctx.fillStyle = '#f5c518';
    ctx.font = 'bold 24px Zabra';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('Impressum', 360, BOX_Y + 35);

    // Scrollbaren Bereich clippen
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

    // Scrollbar
    if (MAX_SCROLL > 0) {
        const scrollbarX = BOX_X + BOX_W - 14;
        const scrollbarH = VISIBLE_HEIGHT;
        const scrollbarY = CONTENT_TOP;

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.roundRect(scrollbarX, scrollbarY, 8, scrollbarH, 4);
        ctx.fill();

        const thumbH = Math.max(30, (VISIBLE_HEIGHT / TOTAL_CONTENT_HEIGHT) * scrollbarH);
        const thumbY = scrollbarY + (impressumScrollY / MAX_SCROLL) * (scrollbarH - thumbH);
        ctx.fillStyle = '#f5c518';
        ctx.beginPath();
        ctx.roundRect(scrollbarX, thumbY, 8, thumbH, 4);
        ctx.fill();
    }

    ctx.restore();
}

function handleImpressumScroll(event) {
    if (!menuOpen) return;
    impressumScrollY += event.deltaY * 0.5;
    impressumScrollY = Math.max(0, Math.min(MAX_SCROLL, impressumScrollY));

    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
    drawMenuButtons(ctx, false, false);
    drawImpressum(ctx);
    drawHamburgerIcon(ctx, true);
}

function handleHamburgerClick(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;

    if (x >= 675 && x <= 715 && y >= 15 && y <= 55) {
        menuOpen = !menuOpen;
        impressumScrollY = 0;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
        drawMenuButtons(ctx, false, false);
        if (menuOpen) drawImpressum(ctx);
        drawHamburgerIcon(ctx, menuOpen);
    }
}

function handleHamburgerHover(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;

    const overHamburger = x >= 675 && x <= 715 && y >= 15 && y <= 55;
    if (overHamburger) canvas.style.cursor = 'pointer';
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
        canvas.removeEventListener('click', handleHamburgerClick);
        canvas.removeEventListener('mousemove', handleMenuHover);
        canvas.removeEventListener('mousemove', handleHamburgerHover);
        canvas.removeEventListener('wheel', handleImpressumScroll);
        startGame();
    }

    if (x >= 380 && x <= 530 && y >= 60 && y <= 105) {
        canvas.removeEventListener('click', handleMenuClick);
        canvas.removeEventListener('click', handleHamburgerClick);
        canvas.removeEventListener('mousemove', handleMenuHover);
        canvas.removeEventListener('mousemove', handleHamburgerHover);
        canvas.removeEventListener('wheel', handleImpressumScroll);
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

    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    roundRect(ctx, 150, 80, 420, 280, 12);

    ctx.letterSpacing = '2px';
    ctx.fillStyle = '#f5c518';
    ctx.font = 'bold 26px Zabra';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText('How to Play', 360, 120);

    ctx.fillStyle = 'white';
    ctx.font = '20px Zabra';
    ctx.letterSpacing = '2px';
    ctx.fillText('⬅ A  /  D ➡   –   Bewegen', 360, 165);
    ctx.fillText('SPACE   –   Springen', 360, 200);
    ctx.fillText('F   –   Flasche werfen', 360, 235);
    ctx.fillText('Auf Hühner springen um sie zu töten!', 360, 270);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

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