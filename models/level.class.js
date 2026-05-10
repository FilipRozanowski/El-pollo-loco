class Level {
    enemies;
    clouds;
    coins;
    bottles;
    backgroundObjects;
    level_end_x = 2200;


    /**
     * Creates a Level with all its game objects.
     * @param {MovableObject[]} enemies
     * @param {Cloud[]} clouds
     * @param {Coin[]} coins
     * @param {Bottle[]} bottles
     * @param {BackgroundObject[]} backgroundObjects
     */
    constructor(enemies, clouds, coins, bottles, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottles;
        this.backgroundObjects = backgroundObjects;
    }
}