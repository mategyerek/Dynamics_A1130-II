// all units SI unless specified

let m1;
let m2;
let x1_0;
let x2_0;
let v1_0;
let v2_0;
let e;
let width1;
let width2;

let x1;
let x2;
let v1;
let v2;


let rho1;
let rho2;

let running = true;
let dt = 0.001;

let pxpm = 20;
let canvas_height = 600
let canvas_width = 900

function setup() {
    m1 = createSlider(0, 100)
    m2 = createSlider(0, 100)
    x1_0 = createSlider(0, 5)
    x2_0 = createSlider(-5, 0)
    v1_0 = createSlider(0, 100)
    v2_0 = createSlider(0, 100)
    e = createSlider(0, 1)
    width1 = createSlider(0, 5)
    width2 = createSlider(0, 5)
    let play_pause = createButton('Play/Pause')
    play_pause.mousePressed(toggle_loop)

    x1 = x1_0.value();
    x2 = x2_0.value();
    v1 = v1_0.value();
    v2 = v2_0.value();

    createCanvas(canvas_width, canvas_height);
}

function draw() {
    background(230);
    translate(50, 600); // move origin to bottom left and leave 50 padding
    scale(pxpm, -pxpm); // set scale to meter, flip y axis
    
    noStroke()
    fill("blue")
    rect(x1, 0, width1.value())
    rect(x2, 0, width2.value())
    
    
    x1 += v1*dt

}

function toggle_loop() {
    if (running) {
        running = false;
        noLoop();
    }
    else {
        running = true;
        loop();
    }
}