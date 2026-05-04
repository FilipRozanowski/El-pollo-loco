class SoundManager {
    muted = false;

    sounds = {
        jump: new Audio('audio/jump.wav'),
    };

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
        return this.muted;
    }

    stopAll() {
    Object.values(this.sounds).forEach(s => {
        s.pause();
        s.currentTime = 0;
    });
}
}