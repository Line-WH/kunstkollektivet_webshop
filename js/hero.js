document.addEventListener("DOMContentLoaded", () => {
    initHeroTypewriter();
});

function initHeroTypewriter() {
    const element = document.querySelector("[data-typewriter]");

    if (!element) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const phrases = [
        "skabt af mennesker",
        "printet lokalt",
        "kurateret med omhu",
        "med kunstnere bag"
    ];

    if (prefersReducedMotion) {
        element.textContent = phrases[0];
        return;
    }

    let phraseIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    function typeLoop() {
        const currentPhrase = phrases[phraseIndex];

        letterIndex += isDeleting ? -1 : 1;
        element.textContent = currentPhrase.slice(0, letterIndex);

        let delay = isDeleting ? 35 : 65;

        if (!isDeleting && letterIndex === currentPhrase.length) {
            delay = 1300;
            isDeleting = true;
        }

        if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 300;
        }

        window.setTimeout(typeLoop, delay);
    }

    typeLoop();
}