
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

let mouseIsClicked = false;

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
let graph1Xdata, graph1Ydata;
let graph2Xdata, graph2Ydata;

// colors
let naviColor = "cyan";
let velColor = "lime";
let spColor = [20,24,62];
let accColor = "red";
let textColor = "white";

//text settings
let spMargin = 10;

//graphs
let removeSize = 10;

let numGraphs = 0;

let graphX = spMargin;
let graphY = 2*spMargin+100
let graphW = spWidth-2*spMargin-removeSize-5;
let graphH = (scrHeight-4*spMargin-100)/2;

let graph1,graph2;
let dataX1, dataX2;
let dataY1, dataY2;

//buttons, dropdowns
let xDropdown, yDropdown;
let addGraph;

let play_pause, reset;
let buttonSize = 50;
let running = false;
let in_setup = true

//stars
let stars = [];
let numStars = 100; // Number of stars in the background

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

function initial_state() {
    posXSI = [0];
    posYSI = [0];
    absDist = [0];
    displacement = [0];
    velXSI = [0];
    velYSI = [0];
    speed = [0];
    accXSI = [0];
    accYSI = [0];
    absAcc = [0];
    t = [0];
    logCount = 0;

    speedX = 0;
    speedY = 0;
    absX = 0;
    absY = 0;
    
    stars = [];

    // initialize star field
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: random(0, scrWidth),
            y: random(0, scrHeight),
            z: random(5, 15) // Star depth
        });
    }
}

function setup() {
    createCanvas(scrWidth+spWidth,scrHeight);
    initial_state();

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

    //create add graph button
    addGraph = createButton("Add graph");
    addGraph.size(0.25*spWidth,49);
    addGraph.position(scrWidth+0.75*spWidth-2*spMargin,spMargin+43);

    addGraph.mousePressed(addGraphPressed);

    textFont(font);

    graph1 = new LinPlot2D(graphX,graphY,graphW,graphH);
    graph2 = new LinPlot2D(graphX,graphY+graphH+spMargin,graphW,graphH);

    // set up control buttons
    play_pause = createSpan("play_circle");
    play_pause.addClass("material-icons");
    play_pause.addClass("icon-btn");
    play_pause.style('font-size',`${buttonSize}px`);
    play_pause.position(spMargin, scrHeight-buttonSize-spMargin);
    reset = createSpan("stop_circle");
    reset.addClass("material-icons");
    reset.addClass("icon-btn");
    reset.style('font-size',`${buttonSize}px`);
    reset.position(buttonSize+spMargin, scrHeight-buttonSize-spMargin);
    play_pause.mousePressed(toggle_loop);
    reset.mousePressed(reset_state);
}

function toggle_loop() {
    running = !running;
    in_setup = running ? false : in_setup;
    play_pause.html(running ? "pause_circle" : "play_circle");
}

function reset_state() {
    running = false;
    in_setup = true;
    play_pause.html("play_circle");
    initial_state();
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
}

function draw() {
    background(0);
    // draw stars
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        
        if (running) {
        star.x -= 0.1*speedX / star.z; // parallax effect
        star.y -= 0.1*speedY / star.z;
        }

        // reset star position if it goes off-screen
        if (star.x < 0) star.x = scrWidth;
        if (star.x > scrWidth) star.x = 0;
        if (star.y < 0) star.y = scrHeight;
        if (star.y > scrHeight) star.y = 0;
        
        // draw star with varying size based on depth
        push();
        noStroke();
        fill('white');
        ellipse(star.x, star.y, 10 / star.z, 10 / star.z);
        pop();
    }
    push();
    translate(scrWidth/2,scrHeight/2); //translate origin to middle

    imageMode(CENTER);

    dt = deltaTime/1000;

    if (running) {
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
    

    } else {image(lander,x,y);}

    // draw velocity vector
    if (speedX != 0 && speedY != 0) {
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
    if ((keyIsDown(65) || keyIsDown(83) || keyIsDown(87) || keyIsDown(68)) && running){
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
        if (graph1Ydata == "a_x" || graph1Ydata == "a_y") { //these dont work for some reason, need to be fixed
            graph1.yAxisSize(-acceleration/100,acceleration/100,acceleration/100);
        } else if (graph1Ydata == "absolute value of acceleration") {
            graph1.yAxisSize(0,Math.SQRT2*acceleration/100,Math.SQRT2*acceleration/100);
        }
    } else if (numGraphs == 1) {
        graph2Xdata = xDropdown.value();
        graph2Ydata = yDropdown.value();
        if (graph2Ydata == "a_x" || graph2Ydata == "a_y") {
            graph2.yAxisSize(-acceleration/100,acceleration/100,acceleration/100);
        } else if (graph2Ydata == "absolute value of acceleration") {
            graph2.yAxisSize(0,Math.SQRT2*acceleration/100,Math.SQRT2*acceleration/100);
        }
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
    if (numGraphs>1) {
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
    if (numGraphs>0) {
        createDeleteButton(graphX-removeSize/2+scrWidth+spMargin+graphW,graphY,deleteGraph1,1,removeSize);
    }
    if (numGraphs>1) {
        createDeleteButton(graphX-removeSize/2+scrWidth+spMargin+graphW,graphY+graphH+spMargin,deleteGraph2,2,removeSize);
    }
    pop();
    pop();
    
}

function createDeleteButton(x, y, func, arg=null, size = 10, primaryColor = "red", secondaryColor = "white", edgeRadius = 0,
    lineWeight = 2, strokeColor = color(200,0,0), sideStrokeWeight = 1, crossOffset = 2) {
    /*
    Creates a square-shaped delete button. Note that x and y are measured from the top-left corner of the canvas.
    */
    push();
    resetMatrix();
    // Set the primary color for the button
    fill(primaryColor);
    stroke(primaryColor);

    // Optional stroke color handling
    if (Math.abs(mouseX-x)<size && Math.abs(mouseY-y)<size) {
        if (strokeColor != null) {
            stroke(strokeColor);
            strokeWeight(sideStrokeWeight);
        } else {
            stroke(primaryColor);
        }
        if (mouseIsPressed && mouseIsClicked) {
            if (arg!=null) {
                func(arg);
            } else {func();}
            mouseIsClicked = false;
        }
    }

    // Draw the button rectangle
    rect(x, y, size, size, edgeRadius);

    // Set the color for the cross (X) symbol
    stroke(secondaryColor);
    strokeWeight(lineWeight);
    line(x + crossOffset, y + crossOffset, x + size - crossOffset, y + size - crossOffset);
    line(x + crossOffset, y + size - crossOffset, x + size - crossOffset, y + crossOffset);

    pop();
}
function deleteGraph1() {
    numGraphs--;
    graph1Xdata = graph2Xdata;
    graph1Ydata = graph2Ydata;
}

function deleteGraph2() {
    numGraphs--;
}

function mouseClicked() {
    mouseIsClicked = true;
}

