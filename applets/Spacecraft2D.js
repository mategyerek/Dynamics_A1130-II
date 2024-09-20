let x = 0, y = 0; // canvas position
let absX = 0, absY = 0; // absolute position
let speedX = 0, speedY = 0; 
let acceleration = 100;
let dt;
let scrWidth = 1000;
let scrHeight = 600;
let imageScale = 0.4;
let carX = -1000, carY = 1000; // absolute position
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

    dt = deltaTime/1000;

    //handle keyboard events
    if (keyIsDown(65) && keyIsDown(68)) {
        image(lander, x, y);
    } else if (keyIsDown(65)) { // 'A' key
        if (keyIsDown(83)) { // 'S' key
            image(landerLeftDown, x, y);
            speedX -= acceleration*dt;
            speedY += acceleration*dt;
            absX -= 0.5*acceleration*Math.pow(dt,2);
            absY += 0.5*acceleration*Math.pow(dt,2);
        } else if (keyIsDown(87)) { // 'W' key
            image(landerLeftUp, x, y);
            speedX -= acceleration*dt;
            speedY -= acceleration*dt;
            absX -= 0.5*acceleration*Math.pow(dt,2);
            absY -= 0.5*acceleration*Math.pow(dt,2);
        } else if (!keyIsDown(68)) { // 'D' key
            image(landerLeft, x, y);
            speedX -= acceleration*dt;
            absX -= 0.5*acceleration*Math.pow(dt,2);
        }
    } else if (keyIsDown(68)) { // 'D' key
        if (keyIsDown(83)) { // 'S' key
            image(landerRightDown, x, y);
            speedX += acceleration*dt;
            speedY += acceleration*dt;
            absX += 0.5*acceleration*Math.pow(dt,2);
            absY += 0.5*acceleration*Math.pow(dt,2);
        } else if (keyIsDown(87)) { // 'W' key
            image(landerRightUp, x, y);
            speedX += acceleration*dt;
            speedY -= acceleration*dt;
            absX += 0.5*acceleration*Math.pow(dt,2);
            absY -= 0.5*acceleration*Math.pow(dt,2);
        } else if (!keyIsDown(65)) { // 'A' key
            image(landerRight, x, y);
            speedX += acceleration*dt;
            absX += 0.5*acceleration*Math.pow(dt,2);
        }
    } else if (keyIsDown(83) && !keyIsDown(87)) { // 'S' key without 'W'
        image(landerDown, x, y);
        speedY += acceleration*dt;
        absY += 0.5*acceleration*Math.pow(dt,2);
    } else if (keyIsDown(87) && !keyIsDown(83)) { // 'W' key without 'S'
        image(landerUp, x, y);
        speedY -= acceleration*dt;
        absY -= 0.5*acceleration*Math.pow(dt,2);
    } else {
        image(lander, x, y);
    }

    // draw arrow pointing towards car

    // draw arrow pointing towards car
    push();
    //HERE - Add this section to draw the arrow inside the circle in the top-left corner
    translate(-width/2 + 50, -height/2 + 50); // Move to top-left corner
    stroke("lime");
    strokeWeight(2);
    noFill();
    ellipse(0, 0, 80, 80); // Draw a circle with a diameter of 80 pixels

    // Calculate vector to car and angle
    let carVector = createVector(carX - absX, carY - absY);
    let heading = carVector.heading();

    // Rotate the arrow to point towards the car
    rotate(heading-HALF_PI);
    stroke("lime");
    fill("lime");
    strokeWeight(3);
    
    // Draw the arrow inside the circle
    line(0,0,0,0) // Move arrow within the circle
    
    // Draw arrow
    line(0,30,-15,15);
    line(0,30,15,15);
    line(0, -30, 0, 30);

    pop();

    // add linear term in position change

    absX += speedX*dt;
    absY += speedY*dt;

    // check for distance between car and lander and render if close
    if (abs(absX-carX)<=1.5*scrWidth && abs(absY-carY)<=1.5*scrHeight) {
        carx = carX-absX;
        cary = carY-absY;
        image(car, carx, cary);
    }
    
    // text printing
    fill("white");
    text(str(absX-carX),-scrWidth/3,scrHeight/3);
    text(str(absY-carY),-scrWidth/3,scrHeight/3+20)
}