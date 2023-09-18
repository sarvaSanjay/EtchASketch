var model = await tf.loadLayersModel('model/model.json');
var coords = [];
const classes = ['car', 'mountain', 'washing_machine', 'harp', 'syringe', 'helmet', 't-shirt', 'peanut', 'helicopter', 'knee', 'suitcase', 'flashlight', 'snake', 'submarine', 'bus', 'anvil', 'crocodile', 'skyscraper', 'carrot', 'popsicle', 'teddy-bear', 'horse', 'compass', 'cake', 'hand', 'couch', 'peas', 'rifle', 'wheel', 'whale', 'matches', 'bread', 'trumpet', 'wristwatch', 'mosquito', 'basketball', 'string_bean', 'crab', 'piano', 'stop_sign', 'broom', 'oven', 'house_plant', 'moustache', 'golf_club', 'van', 'hammer', 'eyeglasses', 'lightning', 'octopus', 'kangaroo', 'book', 'jail', 'garden', 'lipstick', 'hurricane', 'sleeping_bag', 'owl', 'palm_tree', 'elephant', 'lobster', 'cloud', 'fish', 'bulldozer', 'airplane', 'parrot', 'beard', 'basket', 'speedboat', 'strawberry', 'elbow', 'leg', 'lantern', 'hedgehog', 'spider', 'square', 'passport', 'bat', 'house', 'waterslide', 'jacket', 'dresser', 'telephone', 'butterfly', 'mouth', 'computer', 'potato', 'truck', 'umbrella', 'shorts', 'fan', 'hockey_stick', 'megaphone', 'toe', 'The_Great_Wall_of_China', 'necklace', 'lollipop', 'violin', 'nail', 'beach']


async function predict() {
  //the minimum boudning box around the current drawing
  const mbb = getMinBox()
  //cacluate the dpi of the current window 
  const dpi = window.devicePixelRatio
  //extract the image data 
    console.log(mbb.max.x, mbb.max.y, mbb.min.x, mbb.min.y)
  const imgData = ctx.getImageData(mbb.min.x, mbb.min.y,
                    (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);

  const pred = model.predict(preprocess(imgData)).dataSync()
    // Assuming 'pred' contains the prediction values and 'classes' contains the class labels

    // Create an array to store the class-prediction pairs
    console.log(pred);
    const classPredictions = [];

    // Populate the 'classPredictions' array with class-prediction pairs
    for (let i = 0; i < classes.length; i++) {
        classPredictions.push({ class: classes[i], prediction: pred[i] });
    }

    // Sort the 'classPredictions' array in descending order of predictions
    classPredictions.sort((a, b) => b.prediction - a.prediction);

    // Log the top 5 classes and their predictions
    for (let i = 0; i < Math.min(5, classPredictions.length); i++) {
        console.log(`Class: ${classPredictions[i].class}, Prediction: ${classPredictions[i].prediction}`);
        }
  
  }

function preprocess(imgData)
  {
  return tf.tidy(()=>{
      //convert the image data to a tensor 
      let tensor = tf.browser.fromPixels(imgData, 1)
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
function recordCoor()
{
    coords.push({x: lastX, y: lastY})  

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

function handleMousemove(event) {
    draw(event); // Call the first callback function
    recordCoor(event); // Call the second callback function
}

canvas.addEventListener("mousemove", handleMousemove);
canvas.addEventListener("mouseup", () => {isDrawing = false; predict()});
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