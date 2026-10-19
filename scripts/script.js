const layers = Array.from(document.querySelectorAll(".parallax[data-depth]"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let framePending = false;

function setPointerPosition(clientX, clientY) {
    targetX = (clientX / window.innerWidth - 0.5) * 2;
    targetY = (clientY / window.innerHeight - 0.5) * 2;
    requestParallaxFrame();
}

document.addEventListener("pointermove", (event) => {
    setPointerPosition(event.clientX, event.clientY);
});

document.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    requestParallaxFrame();
});

function requestParallaxFrame() {
    if (!framePending) {
        framePending = true;
        window.requestAnimationFrame(animateParallax);
    }
}

function animateParallax() {
    framePending = false;
    let isMoving = false;

    if (!reducedMotion.matches) {
        currentX += (targetX - currentX) * 0.045;
        currentY += (targetY - currentY) * 0.045;

        layers.forEach((layer) => {
            const depth = Number(layer.dataset.depth);
            layer.style.setProperty("--offset-x", `${-currentX * depth * 120}px`);
            layer.style.setProperty("--offset-y", `${-currentY * depth * 90}px`);
        });
        isMoving = Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001;
    } else {
        currentX = 0;
        currentY = 0;
        layers.forEach((layer) => {
            layer.style.setProperty("--offset-x", "0px");
            layer.style.setProperty("--offset-y", "0px");
        });
    }

    if (isMoving) {
        requestParallaxFrame();
    }
}

reducedMotion.addEventListener("change", requestParallaxFrame);
requestParallaxFrame();
