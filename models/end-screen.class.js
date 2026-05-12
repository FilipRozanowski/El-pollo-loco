class Endscreen {

    /**
     * Shows the endscreen overlay for the given type.
     * @param {CanvasRenderingContext2D} ctx - unused, kept for API compatibility
     * @param {HTMLCanvasElement} canvas - unused, kept for API compatibility
     * @param {'won'|'lose'} type
     */
    show(ctx, canvas, type) {
        document.getElementById('endscreen-lose').classList.add('hidden');
        document.getElementById('endscreen-won').classList.add('hidden');
        const id = type === 'won' ? 'endscreen-won' : 'endscreen-lose';
        document.getElementById(id).classList.remove('hidden');
    }


    /**
     * Hides all endscreen overlays.
     */
    hide() {
        document.getElementById('endscreen-lose').classList.add('hidden');
        document.getElementById('endscreen-won').classList.add('hidden');
    }
}