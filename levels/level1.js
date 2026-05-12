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
    const bottle1 = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';
    const bottle2 = 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
    return [
        new Bottle(bottle1),
        new Bottle(bottle2),
        new Bottle(bottle1),
        new Bottle(bottle2),
        new Bottle(bottle1),
        new Bottle(bottle1),
        new Bottle(bottle2)
    ];
}


/**
 * Creates the background objects for level 1 across all segments.
 * @returns {BackgroundObject[]}
 */
function createBackgrounds() {
    const sky          = 'img/5_background/layers/air.png';
    const hillsFar1    = 'img/5_background/layers/3_third_layer/1.png';
    const hillsFar2    = 'img/5_background/layers/3_third_layer/2.png';
    const hillsMid1    = 'img/5_background/layers/2_second_layer/1.png';
    const hillsMid2    = 'img/5_background/layers/2_second_layer/2.png';
    const groundFront1 = 'img/5_background/layers/1_first_layer/1.png';
    const groundFront2 = 'img/5_background/layers/1_first_layer/2.png';

    const SEGMENT_WIDTH = 720;

    return [
        ...createBackgroundSegment(sky, hillsFar2, hillsMid2, groundFront2, -SEGMENT_WIDTH * 2),
        ...createBackgroundSegment(sky, hillsFar2, hillsMid2, groundFront2, -SEGMENT_WIDTH),
        ...createBackgroundSegment(sky, hillsFar1, hillsMid1, groundFront1,  0),
        ...createBackgroundSegment(sky, hillsFar2, hillsMid2, groundFront2,  SEGMENT_WIDTH),
        ...createBackgroundSegment(sky, hillsFar1, hillsMid1, groundFront1,  SEGMENT_WIDTH * 2),
        ...createBackgroundSegment(sky, hillsFar2, hillsMid2, groundFront2,  SEGMENT_WIDTH * 3),
        ...createBackgroundSegment(sky, hillsFar2, hillsMid2, groundFront2,  SEGMENT_WIDTH * 4),
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