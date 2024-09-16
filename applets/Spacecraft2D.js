let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
let dt = 0.01
let scrWidth = 1000;
let scrHeight = 600;
let imageScale = 0.4;
let lander, landerLeft, landerRight, landerUp, landerDown, landerLeftUp, landerRightUp, landerRightDown, landerLeftDown;

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
}

function setup() {
    createCanvas(scrWidth,scrHeight);
}
  
function draw() {
    background(0);
    translate(width/2,height/2); //translate origin to middle
    
    imageMode(CENTER);

    if (keyIsDown(65) && keyIsDown(68)) {
        image(lander, x, y);
    }

    else if (keyIsDown(65)) { // 'A' key
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
        image(landerUp, x, y); // Changed to landerUp (it was incorrectly using landerDown)
    } else {
        image(lander, x, y);
    }
}