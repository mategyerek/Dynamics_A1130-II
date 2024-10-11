
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

let gameStarted = false;


// SI plottables - 100 px = 1 m
let posXSI = [];
let posYSI = [];
let absDist = [];
let displacement = [];
let velXSI = [];
let velYSI = [];
let speed = [];
let accXSI = [];
let accYSI = [];
let absAcc = [];
let t = [];

let logCount = 0;
let graph1Xdata,graph1Ydata;

// colors
let naviColor = "cyan";
let velColor = "lime";
let spColor = [20,24,62];
let accColor = "red";
let textColor = "white";

//text settings
let spMargin = 10;

//graphs
let numGraphs = 0;

let x_ = spMargin;
let y_ = 2*spMargin+100
let w_ = spWidth-2*spMargin;
let h_ = (scrHeight-4*spMargin-100)/2;

let graph1,graph2;
let dataX1, dataX2;
let dataY1, dataY2;

let removeSize = 10;

function euclidNorm(x1,x2) {
    return Math.sqrt(Math.pow(x1,2)+Math.pow(x2,2));
}

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

    font = loadFont("fonts/Inter_18pt-ExtraLight.ttf");
}

function setup() {
    createCanvas(scrWidth+spWidth,scrHeight);
    posXSI.push(0);
    posYSI.push(0);
    absDist.push(0);
    displacement.push(0);
    velXSI.push(0);
    velYSI.push(0);
    speed.push(0);
    accXSI.push(0);
    accYSI.push(0);
    absAcc.push(0);
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

    //xDropdown.changed();

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

    //yDropdown.changed();

    //create add graph button
    addGraph = createButton("Add graph");
    addGraph.size(0.25*spWidth,49);
    addGraph.position(scrWidth+0.75*spWidth-2*spMargin,spMargin+43);

    addGraph.mousePressed(addGraphPressed);

    textFont(font);

    graph1 = new LinPlot2D(x_,y_,w_,h_);
    graph2 = new LinPlot2D(x_,y_+h_+spMargin,w_,h_);
}

function getSelectedData(selection) {
    if (selection == "x") return posXSI;
    if (selection == "y") return posYSI;
    if (selection == "absolute displacement") return displacement;
    if (selection == "distance covered") return absDist;
    if (selection == "v_x") return velXSI;
    if (selection == "v_y") return velYSI;
    if (selection == "speed") return speed;
    if (selection == "a_x") return accXSI;
    if (selection == "a_y") return accYSI;
    if (selection == "absolute value of acceleration") return absAcc;
    if (selection == "t") return t;
    return [];
}

function addGraphPressed() {
    if (numGraphs<2) {
        numGraphs++;
    }
    console.log(absDist);
    gameStarted = true;
    

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
    posYSI.push(-absY/100);
    displacement.push(euclidNorm(posXSI[logCount],posYSI[logCount]));
    absDist.push(absDist[logCount]+euclidNorm(posXSI[logCount+1]-posXSI[logCount],posYSI[logCount+1]-posYSI[logCount]));
    velXSI.push(speedX/100);
    velYSI.push(-speedY/100);
    speed.push(euclidNorm(velXSI[logCount],velYSI[logCount]));
    absAcc.push(euclidNorm(accXSI[logCount],accYSI[logCount]));
    t.push(t[logCount]+dt);
    logCount++;


    

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
    
        fill(accColor);
        stroke(accColor);
        strokeWeight(3);
        translate(0,4);
        let accVec = createVector(accXSI[logCount],-accYSI[logCount]);
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

    //plotting
    if (numGraphs==0) {
        graph1Xdata = xDropdown.value();
        graph1Ydata = yDropdown.value();
    }


    if (numGraphs>0) {
        dataX1 = getSelectedData(graph1Xdata);
        dataY1 = getSelectedData(graph1Ydata);

        if (logCount>2*spWidth) { //improve performance after long runtime
            dataX1 = dataX1.slice(-2*spWidth);
            dataY1 = dataY1.slice(-2*spWidth); 
        }

        graph1.axisNames(graph1Xdata,graph1Ydata);
        graph1.plot(dataX1,dataY1);
    }
    if (numGraphs==2) {
        let graph2Xdata = xDropdown.value();
        let graph2Ydata = yDropdown.value();
        dataX2 = getSelectedData(graph2Xdata);
        dataY2 = getSelectedData(graph2Ydata);

        if (logCount>2*spWidth) {
            dataX2 = dataX2.slice(-2*spWidth);
            dataY2 = dataY2.slice(-2*spWidth); 
        }
        
        graph2.axisNames(graph2Xdata,graph2Ydata);
        graph2.plot(dataX2,dataY2);
    }

    // remove plot buttons
    push();
    strokeWeight(2);
    fill("red");
    if (numGraphs>0) {
    stroke("red");
    rect(x_-removeSize/2,y_,removeSize,removeSize);
    stroke("white");
    line(x_-removeSize/2+2,y_+2,x_+removeSize/2-2,y_+removeSize-2);
    line(x_-removeSize/2+2,y_+removeSize-2,x_+removeSize/2-2,y_+2);
    }
    if (numGraphs>1) {
    stroke("red");
    rect(x_-removeSize/2,y_+h_+spMargin,removeSize,removeSize);
    stroke("white");   
    line(x_-removeSize/2+2,y_+h_+spMargin+2,x_+removeSize/2-2,y_+h_+spMargin+removeSize-2);
    line(x_-removeSize/2+2,y_+h_+spMargin+removeSize-2,x_+removeSize/2-2,y_+h_+spMargin+2);
    pop();
    }

    pop();
}