// all units SI unless specified

// numerical variables
let m1;
let m2;
let x1;
let x2;
let v1;
let v2;
let e;
let w1;
let w2;
// not used yet
let rho1;
let rho2;

// simulation parameters
let running = false;
let in_setup = true
let dt = 0.01;

// canvas parameters
let pxpm = 60;
let canvas_height = 600
let canvas_width = 900

// buttons
let play_pause;
let reset;

// slider objects
let m1_slider;
let m2_slider;
let x1_slider;
let x2_slider;
let v1_slider;
let v2_slider;
let e_slider;

function preload() {
}

function setup() {
    // set up sliders and labels
    m1_slider = createSlider(0, 10, .1, 0.1)
    m2_slider = createSlider(0, 10, 10, 0.1)
    x1_slider = createSlider(0, 5, 1, 0.1)
    x2_slider = createSlider(-5, 0, -1, 0.1)
    v1_slider = createSlider(-10, 0, -2, 0.1)
    v2_slider = createSlider(0, 10, 2, 0.1)
    e_slider = createSlider(0, 1, 1, 0.05)
    slider_list = [m1_slider, m2_slider, x1_slider, x2_slider, v1_slider, v2_slider, e_slider]
    var_name_list = ["m1", "m2", "x1", "x2", "v1", "v2", "e"]
    slider_spacing = 30
    for ([i, slider] of slider_list.entries()) {
        let pos_y = 20 + i*slider_spacing
        //console.log(slider_list.entries())
        slider.position(canvas_width-200, pos_y)
        label = createP(var_name_list[i])
        label.position(canvas_width-260, pos_y-15)
        label.addClass("oncanvas-text")
    }
    
    // set up control buttonss
    play_pause = createSpan("play_circle")
    play_pause.addClass("material-icons")
    play_pause.addClass("icon-btn")
    play_pause.position(15, canvas_height-55)
    reset = createSpan("stop_circle")
    reset.addClass("material-icons")
    reset.addClass("icon-btn")
    reset.position(60, canvas_height-55)
    play_pause.mousePressed(toggle_loop)
    reset.mousePressed(reset_state)

    initial_state()
    createCanvas(canvas_width, canvas_height);
}

function draw() {
    if (running) {
        if ((x1 + w1) > (width / 2 / pxpm) || (x2 - w1) < -(width / 2 / pxpm)) {
            running = false
            play_pause.html("play_circle")
        }
        else {
            if (x1 < x2 && v1 - v2 <= 0) {
                //console.log(v1, v2, m1, m2)
                console.log("collision")
                let temp = -(-m1*v1 + e*m1*v1 - m2*v2 - e*m2*v2)/(m1 + m2)
                v2 = -(-m1*v1 - e*m1*v1 + e*m1*v2 - m2*v2)/(m1 + m2)
                v1 = temp
            }
            
            x1 += v1*dt
            x2 += v2*dt
        }
    }
    if (in_setup) {
        initial_state()
    }
    

    background(0);
    translate(canvas_width/2, canvas_height); // move origin to bottom center
    scale(pxpm, -pxpm); // set scale to meter, flip y axis

    
    strokeWeight(0.03)

    stroke("#C9E2AE")
    fill("#83C167")
    square(x1, 0, w1)

    stroke("#5CD0B3")
    fill("#49A88F")
    rect(x2, 0, -w2, w2)
}

function toggle_loop() {
    running = !running
    in_setup = running ? false : in_setup
    play_pause.html(running ? "pause_circle" : "play_circle")
}

function initial_state() {
    m1 = m1_slider.value();
    m2 = m2_slider.value();
    x1 = x1_slider.value();
    x2 = x2_slider.value();
    v1 = v1_slider.value();
    v2 = v2_slider.value();

    w1 = sqrt(m1)
    w2 = sqrt(m2)
    e = e_slider.value()
}
function reset_state() {
    running = false
    in_setup = true
    play_pause.html("play_circle")
    initial_state()
}