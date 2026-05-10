class StatusBar extends DrawableObject {

    IMAGES_HEALTHBAR = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    ];

    IMAGES_COINBAR = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    IMAGES_BOTTLEBAR = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    IMAGES_ENDBOSSHEALTH = [
        'img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/7_statusbars/2_statusbar_endboss/green/green100.png'
    ];

    IMAGES_BY_TYPE = {};


    /**
     * Creates a StatusBar of the given type at the specified position.
     * @param {'health'|'coin'|'bottle'|'endboss'} type
     * @param {number} x
     * @param {number} y
     */
    constructor(type, x, y) {
        super();
        this.loadImages(this.IMAGES_HEALTHBAR);
        this.loadImages(this.IMAGES_COINBAR);
        this.loadImages(this.IMAGES_BOTTLEBAR);
        this.loadImages(this.IMAGES_ENDBOSSHEALTH);
        this.x = x;
        this.y = y;
        this.width = 210;
        this.height = 60;
        this.type = type;
        this.IMAGES_BY_TYPE = {
            health: this.IMAGES_HEALTHBAR,
            coin: this.IMAGES_COINBAR,
            bottle: this.IMAGES_BOTTLEBAR,
            endboss: this.IMAGES_ENDBOSSHEALTH,
        };
        const startsAtFull = type === 'health' || type === 'endboss';
        this.setPercentage(startsAtFull ? 100 : 0);
    }


    /**
     * Updates the displayed image based on the given percentage.
     * @param {number} percentage
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const images = this.IMAGES_BY_TYPE[this.type];
        this.img = this.imageCache[images[this.resolveImageIndex()]];
    }


    /**
     * Returns the image index (0–5) matching the current percentage.
     * @returns {number}
     */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}