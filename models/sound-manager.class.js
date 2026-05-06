class SoundManager {
    muted = false;

    sounds = {
        jump: new Audio('audio/jump.wav'),
        background: new Audio('audio/background.mp3'),
        hit: new Audio('audio/hit.mp3'),
        chicken: new Audio('audio/chicken_dead.mp3'),
        lose: new Audio('audio/lose.mp3'),
        win: new Audio('audio/win.mp3'),
        boss: new Audio('audio/bosschicken_hurt.mp3')
    };

     constructor() {
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.05;
        this.sounds.jump.volume = 0.3;
         this.sounds.hit.volume = 0.3;
         this.sounds.chicken.volume = 0.3;
         this.sounds.lose.volume = 0.3;
         this.sounds.win.volume = 0.3;
         this.sounds.boss.volume = 0.3;
    }

    play(name) {
        if (this.muted) return;
        let sound = this.sounds[name];
        if (!sound) return;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    stop(name) {
        let sound = this.sounds[name];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    }

    toggleMute() {
    this.muted = !this.muted;
    Object.values(this.sounds).forEach(s => s.muted = this.muted);
    
    if (!this.muted && this.musicShouldPlay) {
        this.sounds.background.play().catch(() => {});
    }
    
    return this.muted;
}

   stopAll() {
    this.musicShouldPlay = false; 
    Object.values(this.sounds).forEach(s => {
        s.pause();
        s.currentTime = 0;
    });
}

startMusic() {
    this.sounds.background.currentTime = 0;
    if (!this.muted) {
        this.sounds.background.play().catch(() => {});
    }
    
    this.musicShouldPlay = true;
}
}