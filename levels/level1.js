/**
 * Creates and returns the Level 1 instance with all enemies, clouds, coins, bottles and backgrounds.
 * @returns {Level}
 */
function createLevel1() {
    const enemies = createEnemies();
    const clouds = createClouds();
    const coins = createCoins();
    const bottles = createBottles();
    const backgrounds = createBackgrounds();
    return new Level(enemies, clouds, coins, bottles, backgrounds);
}


/**
 * Creates the list of enemies for level 1.
 * @returns {MovableObject[]}
 */
function createEnemies() {
    return [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new SmallChicken(),
        new SmallChicken(),
        new Endboss()
    ];
}


/**
 * Creates the list of clouds for level 1.
 * @returns {Cloud[]}
 */
function createClouds() {
    return [
        new Cloud('img/5_background/layers/4_clouds/1.png', 0),
        new Cloud('img/5_background/layers/4_clouds/2.png', 720),
        new Cloud('img/5_background/layers/4_clouds/1.png', 720 * 2),
        new Cloud('img/5_background/layers/4_clouds/2.png', 720 * 3),
        new Cloud('img/5_background/layers/4_clouds/1.png', 720 * 4)
    ];
}


/**
 * Creates the list of collectible coins for level 1.
 * @returns {Coin[]}
 */
function createCoins() {
    return [
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin()
    ];
}


/**
 * Creates the list of collectible bottles for level 1.
 * @returns {Bottle[]}
 */
function createBottles() {
    const img1 = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';
    const img2 = 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
    return [
        new Bottle(img1),
        new Bottle(img2),
        new Bottle(img1),
        new Bottle(img2),
        new Bottle(img1),
        new Bottle(img1),
        new Bottle(img2)
    ];
}


/**
 * Creates the background objects for level 1 across all segments.
 * @returns {BackgroundObject[]}
 */
function createBackgrounds() {
    const air   = 'img/5_background/layers/air.png';
    const l3a   = 'img/5_background/layers/3_third_layer/1.png';
    const l3b   = 'img/5_background/layers/3_third_layer/2.png';
    const l2a   = 'img/5_background/layers/2_second_layer/1.png';
    const l2b   = 'img/5_background/layers/2_second_layer/2.png';
    const l1a   = 'img/5_background/layers/1_first_layer/1.png';
    const l1b   = 'img/5_background/layers/1_first_layer/2.png';
    return [
        ...createBackgroundSegment(air, l3b, l2b, l1b, -1440),
        ...createBackgroundSegment(air, l3b, l2b, l1b, -720),
        ...createBackgroundSegment(air, l3a, l2a, l1a, 0),
        ...createBackgroundSegment(air, l3b, l2b, l1b, 720),
        ...createBackgroundSegment(air, l3a, l2a, l1a, 720 * 2),
        ...createBackgroundSegment(air, l3b, l2b, l1b, 720 * 3),
        ...createBackgroundSegment(air, l3b, l2b, l1b, 720 * 4),
    ];
}


/**
 * Creates one set of 4 background layer objects at the given x offset.
 * @param {string} air
 * @param {string} layer3
 * @param {string} layer2
 * @param {string} layer1
 * @param {number} x
 * @returns {BackgroundObject[]}
 */
function createBackgroundSegment(air, layer3, layer2, layer1, x) {
    return [
        new BackgroundObject(air, x),
        new BackgroundObject(layer3, x),
        new BackgroundObject(layer2, x),
        new BackgroundObject(layer1, x),
    ];
}