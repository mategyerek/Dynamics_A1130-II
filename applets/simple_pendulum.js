// mverything in SI unless specified otherwise
// Physical variables
let g; //gravitational acceleration
let l; //pendulum length
let m; //system total energy
let h; //current height from bottom point
let theta; //angle from vertical
let v; //speed of pendulum
let omega;
let x_data = [];
let y_data = [];
let t = 0;

// Colors
let sp_color = [20,24,62];

// Canvas properties
let canvas_height = 600;
let canvas_width = 900;

let x, y; //canvas position of pendulum in px

let sp_width = 400; //side panel width
let sp_height = canvas_height;
let sp_margin = 10; //side panel margin

let drawing_width = canvas_width-sp_width; //drawing area
let drawing_height = canvas_height;

let pxpm = 100; //pixels per meter

// State
let running = false;
let in_setup = true;

// Buttons, sliders
let g_slider;
let l_slider;
let m_slider;
let theta_slider;
let v_slider;
let slider_spacing = 30;
let graph;

let play_pause;
let reset;

let button_size = 50;
let slider_length = 260;

function setup() {
    createCanvas(canvas_width,canvas_height);

    // sliders
    g_slider = createSlider(1, 25, 9.8, 0.1);
    l_slider = createSlider(0.5, min(drawing_height / 2 / pxpm - 0.5, drawing_width / 2 / pxpm - 0.5), 1.5, 0.1);
    m_slider = createSlider(0.2, 20, 1, 0.2);
    theta_slider = createSlider(0, 180, 5);
    v_slider = createSlider(0, 5, 0, 0.1);

    // set up control buttons
    play_pause = createSpan("play_circle");
    play_pause.addClass("material-icons");
    play_pause.addClass("icon-btn");
    play_pause.style('font-size',`${button_size}px`);
    play_pause.position(drawing_width-2*button_size-sp_margin, sp_margin);
    reset = createSpan("stop_circle");
    reset.addClass("material-icons");
    reset.addClass("icon-btn");
    reset.style('font-size',`${button_size}px`);
    reset.position(drawing_width-button_size-sp_margin, sp_margin);
    play_pause.mousePressed(toggle_loop);
    reset.mousePressed(reset_state);
    graph = new LinPlot2D(600, 300, 220, 220);
    initial_state();
}

function update_sliders(
    slider_list = [g_slider, l_slider, m_slider, theta_slider, v_slider],
    label_list = ['g','l','m','theta','v'],
    unit_list = ["m/s^2", "m", "J", "deg", "m/s"],
) {
    push()
    for ([i, slider] of slider_list.entries()) {
        let pos_y = 20 + i*slider_spacing;
        let label_text = label_list[i];
        slider.position(drawing_width+sp_margin, pos_y);
        slider.size(slider_length);
        fill("#FFFFFF");
        textSize(15);
        text(`${label_text} = ${slider.value()} ${unit_list[i]}`, drawing_width+sp_margin+slider_length+5, pos_y+15);
    }
    pop()
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

function initial_state() {
    g = g_slider.value();
    l = l_slider.value();
    m = m_slider.value();
    
    theta = radians(theta_slider.value());
    v = v_slider.value();
    omega = v / l;
    h = cos(theta) * l;
}

function draw() {
    background(0);
    update_sliders();

    push();
    fill(sp_color);
    stroke(sp_color);
    rect(drawing_width,0,sp_width,sp_height);
    pop();
    update_sliders();
    if (running) {
        let alpha = g/l * sin(theta);
        omega += l * alpha * dt;
        v = l * omega;
        theta += omega * dt;
        h = (cos(theta))*l;
        t += dt;
        x_data.push(t);
        y_data.push(h);
        
    }
    else if (in_setup) {
        initial_state();
    }
    

    stroke("white");
    translate((width - sp_width) / 2, height / 2);
    scale(pxpm, -pxpm);
    // point(0,0);
    push();
    strokeWeight(.012);
    let mx = l * sin(theta)
    let my = l * cos(theta)
    line(0, 0, mx, my);
    translate(mx, my);
    rotate(-theta);
    strokeWeight(.15);
    point(0, 0);
    draw_arrow(0, 0, v/6, 0, "green", 0.02);
    textSize(0.2);
    fill("green");
    noStroke();
    translate(v/12, 0.18);
    rotate(theta + PI);
    text("v", 0, 0);
    pop();


    stroke("red");
    strokeWeight(0.05);
    draw_arrow(2, -l, 2, h, "red", 0.02);
    push();
    stroke("grey");
    strokeWeight(0.01);
    drawingContext.setLineDash([.05, .05])
    line(2, h, l - (1 - sin(theta)) * l, h);
    line(2, -l, -2, -l);
    pop();
    scale(1, -1);
    noStroke();
    fill("red");
    textSize(0.2);
    text("h", 2.1, - (h - l) / 2);
    graph.plot(x_data, y_data);
}