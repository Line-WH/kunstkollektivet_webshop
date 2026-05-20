document.addEventListener("DOMContentLoaded", () => {
    initAnimatedHeroLogo();
});

async function initAnimatedHeroLogo() {
    const logo = document.querySelector(".animated-logo");

    if (!logo) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        logo.classList.add("is-filled");
        return;
    }

    const outlineContainer = logo.querySelector(".animated-logo__outline");
    const outlineSrc = logo.dataset.outlineSrc;

    if (!outlineContainer || !outlineSrc) {
        logo.classList.add("is-filled");
        return;
    }

    try {
        const response = await fetch(outlineSrc);

        if (!response.ok) {
            throw new Error("Kunne ikke hente outline SVG");
        }

        const svgText = await response.text();
        outlineContainer.innerHTML = svgText;

        const drawableElements = outlineContainer.querySelectorAll(
            "path, polygon, polyline, line, circle, rect"
        );

        if (!drawableElements.length) {
            logo.classList.add("is-filled");
            return;
        }

        drawableElements.forEach((element) => {
            const length = getSvgElementLength(element);

            if (!length) {
                return;
            }

            element.style.strokeDasharray = length;
            element.style.strokeDashoffset = length;
            element.style.transition = "none";
        });

        // Force browseren til at registrere start-state før animationen begynder
        outlineContainer.getBoundingClientRect();

        logo.classList.add("is-drawing");

        await waitForNextFrame();
        await waitForNextFrame();

        drawableElements.forEach((element) => {
            const length = getSvgElementLength(element);

            if (!length) {
                return;
            }

            element.style.transition = "stroke-dashoffset 2200ms ease-in-out";
            element.style.strokeDashoffset = "0";
        });

        setTimeout(() => {
            logo.classList.add("is-filled");
        }, 2350);

    } catch (error) {
        console.warn(error);
        logo.classList.add("is-filled");
    }
}

function getSvgElementLength(element) {
    if (typeof element.getTotalLength === "function") {
        return element.getTotalLength();
    }

    return 0;
}

function waitForNextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(resolve);
    });
}