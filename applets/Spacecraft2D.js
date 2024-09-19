let x = 0, y = 0; // canvas position
let absX = 0, absY = 0; // absolute position
let speedX = 0, speedY = 0; 
let dt = 0.01
let scrWidth = 1000;
let scrHeight = 600;
let imageScale = 0.4;
let carX = -69690, carY = 12450; // absolute position
let carx, cary; // canvas position
let lander, landerLeft, landerRight, landerUp, landerDown, landerLeftUp, landerRightUp, landerRightDown, landerLeftDown, car;

// Utility function to load and resize images with a callback
function loadResizedImage(imgPath, scale, callback) {
    loadImage(imgPath, (img) => {
        img.resize(int(img.width * scale), 0);
        callback(img);
    });
}

function preload() {
    // Load and resize images using a callback as loadImage is async
    loadResizedImage("graphics/lander.png", imageScale, (img) => lander = img);
    loadResizedImage("graphics/lander_left.png", imageScale, (img) => landerLeft = img);
    loadResizedImage("graphics/lander_right.png", imageScale, (img) => landerRight = img);
    loadResizedImage("graphics/lander_up.png", imageScale, (img) => landerUp = img);
    loadResizedImage("graphics/lander_down.png", imageScale, (img) => landerDown = img);
    loadResizedImage("graphics/lander_leftup.png", imageScale, (img) => landerLeftUp = img);
    loadResizedImage("graphics/lander_rightup.png", imageScale, (img) => landerRightUp = img);
    loadResizedImage("graphics/lander_rightdown.png", imageScale, (img) => landerRightDown = img);
    loadResizedImage("graphics/lander_leftdown.png", imageScale, (img) => landerLeftDown = img);
    loadResizedImage("graphics/car.png", imageScale/2, (img) => car = img);
}

function setup() {
    createCanvas(scrWidth,scrHeight);
}
  
function draw() {
    background(0);
    translate(width/2,height/2); //translate origin to middle

    imageMode(CENTER);

    //handle keyboard events
    if (keyIsDown(65) && keyIsDown(68)) {
        image(lander, x, y);
    } else if (keyIsDown(65)) { // 'A' key
        if (keyIsDown(83)) { // 'S' key
            image(landerLeftDown, x, y);
        } else if (keyIsDown(87)) { // 'W' key
            image(landerLeftUp, x, y);
        } else if (!keyIsDown(68)) { // 'D' key
            image(landerLeft, x, y);
        }
    } else if (keyIsDown(68)) { // 'D' key
        if (keyIsDown(83)) { // 'S' key
            image(landerRightDown, x, y);
        } else if (keyIsDown(87)) { // 'W' key
            image(landerRightUp, x, y);
        } else if (!keyIsDown(65)) { // 'A' key
            image(landerRight, x, y);
        }
    } else if (keyIsDown(83) && !keyIsDown(87)) { // 'S' key without 'W'
        image(landerDown, x, y);
    } else if (keyIsDown(87) && !keyIsDown(83)) { // 'W' key without 'S'
        image(landerUp, x, y);
    } else {
        image(lander, x, y);
    }

    // draw arrow pointing towards car
    push();
    let carVector = createVector(carX-absX,carY-absY);
    let heading = carVector.heading();
    rotate(heading);
    stroke("red");
    fill("red");
    strokeWeight(5);

    

    // Move inward 5 pixels from the edge
    translate(0, distanceToEdge - 5); // Translate along the Y-axis after rotation

    triangle(0,0,-10,-25,10,-25);
    line(0,-100,0,-25);

    pop();



    // check for distance between car and lander and render if close
    if (abs(absX-carX)<=1.5*scrWidth && abs(absY-carY)<=1.5*scrHeight) {
        carx = carX-absX;
        cary = carY-absY;
        image(car, carx, cary);
    }
}