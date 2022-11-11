function makeGrid(numSquare) {
    for(i = 0; i < numSquare * numSquare; i++){
        let box = document.createElement('div');
        box.style.width = String(sideLen / numSquare) + 'px';
        side = String(sideLen / (numSquare)) + 'px';
        box.setAttribute('class', 'box');
        box.setAttribute('style', `height: ${side}; width: ${side}`);
        grid.appendChild(box);
    }
    let boxes = document.querySelectorAll('.box');
    let move = false
    boxes.forEach(box => {
        box.addEventListener('mousedown', (e) => {
            move = true;
        });
        box.addEventListener('mouseover', (e) => {
            if (move) {
                e.target.classList.add("active");
            }
        });
        box.addEventListener('mouseup', (e) => {
            move = false;
        });
    })
}

function newGrid() {
    //move = false;
    //boxes.forEach(box => (box.classList.remove('active')));
    let n = range.value;
    grid.innerHTML = '';
    console.log(n);
    makeGrid(n);
}

let grid = document.querySelector('.grid');
grid.setAttribute('style', 'height: 640px; width: 640px')
let sideLen = 640;
makeGrid(16);



let range = document.querySelector('#pixels');
let pixels = document.querySelector('#pixel')
pixels.textContent = range.value;

range.oninput = function() {
    pixels.textContent = this.value;
}

let button = document.querySelector('button');
console.log(button)
button.addEventListener('click', newGrid);