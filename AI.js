var model = await tf.loadLayersModel('model/model.json');
var coords = [];
async function predict() {
  //the minimum boudning box around the current drawing
  const mbb = getMinBox()
  //cacluate the dpi of the current window 
  const dpi = window.devicePixelRatio
  //extract the image data 
  console.log(mbb.max.x, mbb.max.y, mbb.min.x, mbb.min.y)
  console.log(coords)
  const imgData = ctx.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
                    (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);

  const pred = model.predict(preprocess(imgData)).dataSync()
  
  }

function preprocess(imgData)
  {
  return tf.tidy(()=>{
      //convert the image data to a tensor 
      let tensor = tf.browser.fromPixels(imgData, numChannels= 1)
      //resize to 28 x 28 
      const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
      // Normalize the image 
      const offset = tf.scalar(255.0);
      const normalized = tf.scalar(1.0).sub(resized.div(offset));
      //We add a dimension to get a batch shape 
      const batched = normalized.expandDims(0)
      return batched
  })
  }

  //record the current drawing coordinates 	  
function recordCoor(event)
{
  //get current mouse coordinate 
  var pointer = {x: lastX, y: lastY}
  var posX = pointer.x;
  var posY = pointer.y;
  
  //record the point if withing the canvas and the mouse is pressed 
  if(posX >=0 && posY >= 0 && !isDrawing)  
  {	  
    coords.push(pointer) 
  } 
}
	  
//get the best bounding box by finding the top left and bottom right cornders    
function getMinBox(){
	
   var coorX = coords.map(function(p) {return p.x});
   var coorY = coords.map(function(p) {return p.y});
   //find top left corner 
   var min_coords = {
    x : Math.min.apply(null, coorX),
    y : Math.min.apply(null, coorY)
   }
   //find right bottom corner 
   var max_coords = {
    x : Math.max.apply(null, coorX),
    y : Math.max.apply(null, coorY)
   }
   return {
    min : min_coords,
    max : max_coords
   }
}


// Get the canvas element and its context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Variables to track drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Event listeners for mouse actions
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
});

canvas.addEventListener("mousemove", () => {draw;recordCoor();});
canvas.addEventListener("mouseup", () => {isDrawing = false; predict()});
canvas.addEventListener("mouseout", () => isDrawing = false);

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

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Add a button to clear the canvas
const clearButton = document.createElement("button");
clearButton.textContent = "Clear Canvas";
clearButton.addEventListener("click", clearCanvas);
document.body.appendChild(clearButton);
