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
let sidePanelWidth = 400;

// SI plottables - 100 px = 1 m
let posXSI = [];
let posYSI = [];
let velXSI = [];
let velYSI = [];
let accXSI = [];
let accYSI = [];
let t = [];

// colors
let naviColor = "cyan";
let velColor = "lime";
let sidePanelColor = [20,24,62];
let accColor = "red";

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
    createCanvas(scrWidth+sidePanelWidth,scrHeight);
    posXSI.push(absX/100);
    posYSI.push(absY/100);
    velXSI.push(speedX/100);
    velYSI.push(speedY/100);
    accXSI.push(0);
    accYSI.push(0);
    t.push(0);
}
  
function draw() {
    background(0);

    translate(scrWidth/2,scrHeight/2); //translate origin to middle

    imageMode(CENTER);

    dt = deltaTime/1000;

    // handle keyboard events and logging
    if (keyIsDown(65) && keyIsDown(68)) {
        image(lander, x, y);
        accXSI.push(0);
        accYSI.push(0);

    } else if (keyIsDown(65)) { // 'A' key
        if (keyIsDown(83)) { // 'S' key
            image(landerLeftDown, x, y);
            speedX -= acceleration*dt;
            speedY += acceleration*dt;
            absX -= 0.5*acceleration*Math.pow(dt,2);
            absY += 0.5*acceleration*Math.pow(dt,2);

            accXSI.push(-acceleration/100);
            accYSI.push(-acceleration/100); // note inverted y-axis

        } else if (keyIsDown(87)) { // 'W' key
            image(landerLeftUp, x, y);
            speedX -= acceleration*dt;
            speedY -= acceleration*dt;
            absX -= 0.5*acceleration*Math.pow(dt,2);
            absY -= 0.5*acceleration*Math.pow(dt,2);

            accXSI.push(-acceleration/100);
            accYSI.push(acceleration/100);

        } else if (!keyIsDown(68)) { // 'D' key
            image(landerLeft, x, y);
            speedX -= acceleration*dt;
            absX -= 0.5*acceleration*Math.pow(dt,2);

            accXSI.push(-acceleration/100);
            accYSI.push(0);
        }
    } else if (keyIsDown(68)) { // 'D' key
        if (keyIsDown(83)) { // 'S' key
            image(landerRightDown, x, y);
            speedX += acceleration*dt;
            speedY += acceleration*dt;
            absX += 0.5*acceleration*Math.pow(dt,2);
            absY += 0.5*acceleration*Math.pow(dt,2);

            accXSI.push(acceleration/100);
            accYSI.push(-acceleration/100);

        } else if (keyIsDown(87)) { // 'W' key
            image(landerRightUp, x, y);
            speedX += acceleration*dt;
            speedY -= acceleration*dt;
            absX += 0.5*acceleration*Math.pow(dt,2);
            absY -= 0.5*acceleration*Math.pow(dt,2);

            accXSI.push(acceleration/100);
            accYSI.push(acceleration/100);

        } else if (!keyIsDown(65)) { // 'A' key
            image(landerRight, x, y);
            speedX += acceleration*dt;
            absX += 0.5*acceleration*Math.pow(dt,2);

            accXSI.push(acceleration/100);
            accYSI.push(0);

        }
    } else if (keyIsDown(83) && !keyIsDown(87)) { // 'S' key without 'W'
        image(landerDown, x, y);
        speedY += acceleration*dt;
        absY += 0.5*acceleration*Math.pow(dt,2);

        accXSI.push(0);
        accYSI.push(-acceleration/100);

    } else if (keyIsDown(87) && !keyIsDown(83)) { // 'W' key without 'S'
        image(landerUp, x, y);
        speedY -= acceleration*dt;
        absY -= 0.5*acceleration*Math.pow(dt,2);

        accXSI.push(0);
        accYSI.push(acceleration/100);

    } else {
        image(lander, x, y);
        accXSI.push(0);
        accYSI.push(0);
    }

    // add linear term in position change
    absX += speedX*dt;
    absY += speedY*dt;

    // logging part 2
    posXSI.push(absX/100);
    posYSI.push(absY/100);
    velXSI.push(speedX/100);
    velYSI.push(-speedY/100);
    t.push(t[t.length-1]+dt/1000);

    // draw velocity vector
    {
    push();

    fill(velColor)
    stroke(velColor);
    strokeWeight(3);
    translate(0,4);
    let speedVec = createVector(speedX,speedY);
    let heading = speedVec.heading();
    let magn = speedVec.mag()/10; // scale of x10
    rotate(heading-HALF_PI);

    line(x,y,x,magn);
    triangle(x,magn+10,x+5,magn,x-5,magn);
    let labelVec = createVector(x,magn+25);

    pop();

    // Draw the "v" next to the velocity vector
    labelVec.rotate(heading-HALF_PI);
    fill(velColor);
    noStroke();    
    textSize(18);  
    textAlign(CENTER, CENTER);

    text("v", labelVec.x, labelVec.y); // Position "v" slightly beyond the tip of the arrow

    }

    // draw acceleration vector
    if (keyIsDown(65) || keyIsDown(83) || keyIsDown(87) || keyIsDown(68)){
        push();
    
        fill(accColor)
        stroke(accColor);
        strokeWeight(3);
        translate(0,4);
        let accVec = createVector(accXSI[accXSI.length-1],-accYSI[accXSI.length-1]);
        let heading = accVec.heading();
        let magn = accVec.mag(); // scale of x1
        rotate(heading-HALF_PI);
    
        line(x,y,x,magn);
        triangle(x,magn+10,x+5,magn,x-5,magn);
        let labelVec = createVector(x,magn+25);
    
        pop();
    
        // Draw the "a" next to the acceleration vector
        labelVec.rotate(heading-HALF_PI);
        fill(accColor);
        noStroke();    
        textSize(18);  
        textAlign(CENTER, CENTER);
    
        text("a", labelVec.x, labelVec.y); // Position "a" slightly beyond the tip of the arrow
    
        }
    

    // draw arrow pointing towards car
    {
    push();

    translate(-scrWidth/2 + 50, -scrHeight/2 + 50); // Move to top-left corner
    stroke(naviColor);
    strokeWeight(2);
    noFill();
    ellipse(0, 0, 80, 80); // Draw a circle with a diameter of 80 pixels

    // Calculate vector to car and angle
    let carVector = createVector(carX - absX, carY - absY);
    let heading = carVector.heading();

    // Rotate the arrow to point towards the car
    rotate(heading-HALF_PI);
    stroke(naviColor);
    fill(naviColor);
    strokeWeight(3);
    
    // Draw the arrow inside the circle
    line(0,0,0,0) // Move arrow within the circle
    
    // Draw arrow
    line(0,30,-15,15);
    line(0,30,15,15);
    line(0, -30, 0, 30);

    pop();
    }

    // check for distance between car and lander and render if close
    if (abs(absX-carX)<=1.5*scrWidth && abs(absY-carY)<=1.5*scrHeight) {
        carx = carX-absX;
        cary = carY-absY;
        image(car, carx, cary);
    }

    // sidepanel

    push();
    translate(-scrWidth/2,-scrHeight/2);
    fill(sidePanelColor);
    stroke(sidePanelColor);
    rect(scrWidth,0,sidePanelWidth,scrHeight);
    pop();
    
}