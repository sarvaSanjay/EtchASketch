// Function to draw on the canvas
function draw(e) {
    if (!isDrawing) return;

    ctx.strokeStyle = "#000"; // Set the stroke color (black)
    ctx.lineWidth = 2; // Set the line width

    ctx.beginPath();
    ctx.moveTo(lastX, lastY); // Start from the last position
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
    ctx.lineTo(lastX, lastY); // Draw a line to the current position
    ctx.stroke(); // Apply the stroke
}

function newGrid() {
    canvas.setAttribute('height', range.value * 10);
    canvas.setAttribute('width', range.value * 10);
    sidelen = range.value * 10;
    getImageData();
}

function getImageData() {
    const imageData = ctx.createImageData(sidelen, sidelen);
    console.log(imageData.data.length);
}

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext("2d");
let sidelen = + canvas.getAttribute('height');
// Variables to track drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Event listeners for mouse actions
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseout", () => isDrawing = false);  
canvas.setAttribute('style', 'height: 640; width: 640');




let range = document.querySelector('#pixels');
let pixels = document.querySelector('#pixel')
pixels.textContent = range.value;

range.oninput = function() {
    pixels.textContent = this.value;
}

let button = document.querySelector('button');
button.addEventListener('click', newGrid);