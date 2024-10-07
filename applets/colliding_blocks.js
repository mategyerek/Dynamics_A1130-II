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
let dt = 0.01;

let pxpm = 60;
let canvas_height = 600
let canvas_width = 900

function setup() {
    m1 = createSlider(0, 10, 1, 0.1)
    m2 = createSlider(0, 10, 1, 0.1)
    x1_0 = createSlider(0, 5, 1, 0.1)
    x2_0 = createSlider(-5, 0, -1, 0.1)
    v1_0 = createSlider(-10, 0, -1, 0.1)
    v2_0 = createSlider(0, 10, 1, 0.1)
    e = createSlider(0, 1, 1, 0.05)
    let play_pause = createButton("Play/Pause")
    let reset = createButton("Reset")
    play_pause.mousePressed(toggle_loop)
    reset.mousePressed(initial_state)

    initial_state()
    createCanvas(canvas_width, canvas_height);
}

function draw() {
    
    if (running) {
        x1 += v1*dt
        x2 += v2*dt
        if (x1 < x2 && v1 <= 0 && v2 >= 0) {
            console.log(v1, v2, m1, m2)
            console.log("collision")
            let temp = -(-m1.value()*v1 + e.value()*m1.value()*v1 - m2.value()*v2 - e.value()*m2.value()*v2)/(m1.value() + m2.value())
            v2 = -(-m1.value()*v1 - e.value()*m1.value()*v1 + e.value()*m1.value()*v2 - m2.value()*v2)/(m1.value() + m2.value())
            v1 = temp
            console.log(v1, v2)
        }
    }
    

    background(230);
    translate(canvas_width/2, canvas_height); // move origin to bottom center
    scale(pxpm, -pxpm); // set scale to meter, flip y axis

    noStroke()
    fill("blue")
    square(x1, 0, m1.value())
    fill("red")
    rect(x2, 0, -m2.value(), m2.value())
}

function toggle_loop() {
    running = !running
}

function initial_state() {
    x1 = x1_0.value();
    x2 = x2_0.value();
    v1 = v1_0.value();
    v2 = v2_0.value();
}