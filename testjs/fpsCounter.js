const canvas = document.getElementById('fpsCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables for FPS calculation
let lastTime = 0;
let fps = 0;

function update(timestamp) {
    // Calculate FPS
    if (lastTime) {
        const deltaTime = timestamp - lastTime;
        fps = Math.round(1000 / deltaTime);
    }
    lastTime = timestamp;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display FPS
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`FPS: ${fps}`, 10, 30);

    // Request the next frame
    requestAnimationFrame(update);
}

// Start the FPS counter
requestAnimationFrame(update);
