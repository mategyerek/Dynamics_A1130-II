let x = 0, y = 0; // canvas position
let absX = 0, absY = 0; // absolute position
let imageScale = 0.4;
let carX = -1000, carY = 1000; // absolute position
let carx, cary; // canvas position

let speedX = 0, speedY = 0; 
let acceleration = 100;
let dt;

let scrWidth = 800;
let scrHeight = 600;
let spWidth = 400;

let lander, landerLeft, landerRight, landerUp, landerDown, landerLeftUp, landerRightUp, landerRightDown, landerLeftDown, car;


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
let spColor = [20,24,62];
let accColor = "red";
let textColor = "white";

//text settings
let spMargin = 10;


// Utility function to load and resize images with a callback
function loadResizedImage(imgPath, scale, callback) {
    loadImage(imgPath, (img) => {
        img.resize(int(img.width * scale), 0);
        callback(img);
    });
}

function drawAxis(x,y,length,start,end,step,horizontal=true,axisName="Axis",width=1,notchHeight=4,labelSize=15,color="white"){
    push();
    textAlign(CENTER,TOP);
    textSize(labelSize);
    fill(color);
    stroke(color);
    strokeWeight(width);
    translate(x,y);

    let nameX = length/2;
    let nameY, notchLabelOffSet;
    let headOffSetX = 7, headOffSetY = 7;

    if (!horizontal) {
        notchLabelOffSet=-Math.max(headOffSetY,notchHeight)-labelSize-5;
        nameY = notchLabelOffSet-labelSize-5;

        translate(Math.max(notchHeight,labelSize)+2*labelSize,0);
        rotate(-HALF_PI);

    } else {
        notchLabelOffSet = Math.max(headOffSetY,notchHeight);
        nameY = notchLabelOffSet+labelSize;
        
    }
    line(0,0,length,0);

    //labels
    text(axisName,nameX,nameY);

    //arrow at end
    line(length,0,length-headOffSetX,headOffSetY);
    line(length,0,length-headOffSetX,-headOffSetY);

    //notches
    let lastNotchOffSet = 10;
    let notchNum = Math.floor((end-start)/step)+1;
    let notch, notchX;
    let notchStep = (length-lastNotchOffSet)/(notchNum-1);

    line(0,-notchHeight/2,0,notchHeight/2);
    for (let i = 0;i < notchNum;i++) {
        notchX = i*notchStep;
        notch = start+i*step;
        line(notchX,-notchHeight/2,notchX,notchHeight/2);
        text(notch,notchX,notchLabelOffSet);
    }
    pop();
}

function drawAxisSystem(x,y,w,h,startX,endX,startY,endY,stepX,stepY,xAxisName="x-axis",yAxisName="y-axis",width=1,notchHeight=4,labelSize=15,color="white") {
    
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

    font = loadFont("fonts/Inter_18pt-ExtraLight.ttf");
}

function setup() {
    createCanvas(scrWidth+spWidth,scrHeight);
    posXSI.push(absX/100);
    posYSI.push(absY/100);
    velXSI.push(speedX/100);
    velYSI.push(speedY/100);
    accXSI.push(0);
    accYSI.push(0);
    t.push(0);

    //dropdowns
    // x-axis dropdown
    xDropdown = createSelect(false);

    xDropdown.option("t");
    xDropdown.option("x");
    xDropdown.option("y");
    xDropdown.option("absolute displacement");
    xDropdown.option("distance covered");
    xDropdown.option("v_x");
    xDropdown.option("v_y");
    xDropdown.option("speed");
    xDropdown.option("a_x");
    xDropdown.option("a_y");
    xDropdown.option("absolute value of acceleration");

    xDropdown.position(scrWidth+2*spMargin+50,spMargin+43);

    // y-axis dropdown
    yDropdown = createSelect(false);
    
    yDropdown.option("x");
    yDropdown.option("y");
    yDropdown.option("absolute displacement");
    yDropdown.option("distance covered");
    yDropdown.option("v_x");
    yDropdown.option("v_y");
    yDropdown.option("speed");
    yDropdown.option("a_x");
    yDropdown.option("a_y");
    yDropdown.option("absolute value of acceleration");
    yDropdown.option("t");
    
    yDropdown.position(scrWidth+2*spMargin+50,spMargin+73);

    //create add graph button
    addGraph = createButton("Add graph");
    addGraph.size(0.25*spWidth,49);
    addGraph.position(scrWidth+0.75*spWidth-2*spMargin,spMargin+43);

    textFont(font);
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
    let magn = speedVec.mag()/10; //scale x0.001
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
        let magn = accVec.mag()*10; //scale x0.1
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
    fill(spColor);
    stroke(spColor);
    rect(scrWidth,0,spWidth,scrHeight);

    translate(scrWidth,0);

    noFill();
    stroke(textColor);
    rect(spMargin,spMargin,spWidth-2*spMargin,100,10,10,10,10);

    textAlign(CENTER,TOP);
    fill(textColor);

    textSize(25);
    text("Add new plot",spWidth/2,spMargin);

    textAlign(LEFT,BOTTOM);
    textSize(15);
    text("x-axis",2*spMargin,70);
    text("y-axis",2*spMargin,100);

    drawAxis(spMargin,100+100+2*spMargin,100,0,30,10,false,"y-axis");
    drawAxis(spMargin,100+100+2*spMargin,spWidth-2*spMargin,10,100,10,true,"x-axis");

    pop();
}