class SoundManager {
    muted = false;
    musicShouldPlay = false;

    sounds = {
        jump:       new Audio('audio/jump.wav'),
        background: new Audio('audio/background.mp3'),
        hit:        new Audio('audio/hit.mp3'),
        chicken:    new Audio('audio/chicken_dead.mp3'),
        lose:       new Audio('audio/lose.mp3'),
        win:        new Audio('audio/win.mp3'),
        boss:       new Audio('audio/bosschicken_hurt.mp3')
    };


    /**
     * Initializes all sound volumes and sets the background music to loop.
     */
    constructor() {
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.05;
        this.setSoundVolumes(0.3, ['jump', 'hit', 'chicken', 'lose', 'win', 'boss']);
    }


    /**
     * Sets the volume for multiple sounds by name.
     * @param {number} volume
     * @param {string[]} names
     */
    setSoundVolumes(volume, names) {
        names.forEach(name => {
            if (this.sounds[name]) this.sounds[name].volume = volume;
        });
    }


    /**
     * Plays a sound by name from the beginning, unless muted.
     * @param {string} name
     */
    play(name) {
        if (this.muted) return;
        let sound = this.sounds[name];
        if (!sound) return;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }


    /**
     * Stops a sound by name and resets its playback position.
     * @param {string} name
     */
    stop(name) {
        let sound = this.sounds[name];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    }


    /**
     * Toggles mute state for all sounds and resumes music if unmuted.
     * @returns {boolean} current muted state
     */
    toggleMute() {
        this.muted = !this.muted;
        Object.values(this.sounds).forEach(s => s.muted = this.muted);
        if (!this.muted && this.musicShouldPlay) this.sounds.background.play().catch(() => {});
        return this.muted;
    }


    /**
     * Stops and resets all sounds and disables background music flag.
     */
    stopAll() {
        this.musicShouldPlay = false;
        Object.values(this.sounds).forEach(s => {
            s.pause();
            s.currentTime = 0;
        });
    }


    /**
     * Starts the background music from the beginning if not muted.
     */
    startMusic() {
        this.musicShouldPlay = true;
        this.sounds.background.currentTime = 0;
        if (!this.muted) this.sounds.background.play().catch(() => {});
    }
}