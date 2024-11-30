// mverything in SI unless specified otherwise
// Physical variables
let g; //gravitational acceleration
let l; //pendulum length
let m; //system total energy
let h; //current height from bottom point
let theta; //angle from vertical
let v; //speed of pendulum
let omega;
let t = 0;
let dt = 0.01;
let E_total;
let e_kin;
let e_pot;

// Colors
let sp_color = [20, 24, 62];

// Canvas properties
let canvas_height = 600;
let canvas_width = 900;

let x, y; //canvas position of pendulum in px

let sp_width = 400; //side panel width
let sp_height = canvas_height;
let sp_margin = 10; //side panel margin

let drawing_width = canvas_width - sp_width; //drawing area
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

let play_pause;
let reset;

let button_size = 50;
let slider_length = 260;

function setup() {
    createCanvas(canvas_width,canvas_height);

    // sliders
    g_slider = createSlider(1, 12, 9.8, 0.1);
    l_slider = createSlider(0.5, min(drawing_height / 2 / pxpm - 0.5, drawing_width / 2 / pxpm - 0.5), 1.5, 0.1);
    m_slider = createSlider(0.2, 2, 2, 0.1);
    theta_slider = createSlider(0, 180, 5);
    v_slider = createSlider(0, 5, 0, 0.1);

    // set up control buttons
    play_pause = createSpan("play_circle");
    play_pause.addClass("material-icons");
    play_pause.addClass("icon-btn");
    play_pause.style('font-size',`${button_size}px`);
    play_pause.position(drawing_width - 2 * button_size-sp_margin, sp_margin);
    reset = createSpan("stop_circle");
    reset.addClass("material-icons");
    reset.addClass("icon-btn");
    reset.style('font-size',`${button_size}px`);
    reset.position(drawing_width - button_size - sp_margin, sp_margin);
    play_pause.mousePressed(toggle_loop);
    reset.mousePressed(reset_state);
    initial_state();
}

function update_sliders(
    slider_list = [g_slider, l_slider, m_slider, theta_slider, v_slider],
    label_list = ['g', 'l', 'm', 'theta', 'v'],
    unit_list = ["m/s^2", "m", "kg", "deg", "m/s"],
) {
    push()
    for ([i, slider] of slider_list.entries()) {
        let pos_y = 20 + i * slider_spacing;
        let label_text = label_list[i];
        slider.position(drawing_width + sp_margin, pos_y);
        slider.size(slider_length);
        fill("#FFFFFF");
        textSize(15);
        text(`${label_text} = ${slider.value()} ${unit_list[i]}`, drawing_width + sp_margin + slider_length + 5, pos_y + 15);
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
    h = (cos(theta) + 1) * l;
    E_total = e_kin + e_pot;
    e_kin = 1/2 * m * v * v;
    e_pot = m * g * h;
}

function draw() {
    background(0);
    update_sliders();

    push();
    fill(sp_color);
    stroke(sp_color);
    rect(drawing_width, 0, sp_width,sp_height);
    pop();
    update_sliders();
    if (running) {
        let alpha = g / l * sin(theta);
        omega += alpha * dt;
        v = l * omega;
        theta += 1/2 * alpha * dt * dt + omega * dt;
        h = (cos(theta) + 1)*l;
        t += dt;
        
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
    let mx = l * sin(theta);
    let my = l * cos(theta);
    line(0, 0, mx, my);
    translate(mx, my);
    rotate(-theta);
    strokeWeight(.15);
    point(0, 0);
    draw_arrow(0, 0, v / 6, 0, "green", 0.02);
    textSize(0.2);
    fill("green");
    noStroke();
    translate(v / 12, 0.18);
    rotate(theta + PI);
    text("v", 0, 0);
    pop();


    stroke("red");
    strokeWeight(0.05);
    draw_arrow(2, -l, 2, h - l, "red", 0.02);
    push();
    stroke("grey");
    strokeWeight(0.01);
    drawingContext.setLineDash([.05, .05])
    line(2, h - l, l - (1 - sin(theta)) * l, h - l);
    line(2, -l, -2, -l);
    pop();
    scale(1, -1);
    noStroke();
    fill("red");
    textSize(0.2);
    text("h", 2.1, - (h - 2 * l) / 2);
    e_kin = 1/2 * m * v * v;
    e_pot = m * g * h;
    scale(1, -1);
    console.log(e_kin + e_pot, e_kin, e_pot);
    draw_stacked_bars(4, -2.5, [e_kin, e_pot], ["green", "red"], 1, E_total / 30);
}

function draw_stacked_bars(x, y, bar_list, color_list, w = 0.5, h = 2) {
    push();
    translate(x, y);
    noStroke()
    push();
    fill("white");
    scale(1, -1);
    text("Energy", -1, -h/2);
    fill("green");
    text("Kinetic", 1.2, 0);
    fill("red");
    text("Potential", 1.2, -h+0.13);
    point(0, 0);
    pop();
    if (bar_list.length != color_list.length) {
        console.warn("bar list and color list must have the same length");
        return;
    }
    let h_current = 0;
    let bar_scale = h / bar_list.reduce((a, b) => a + b);
    //console.log(bar_scale)
    for (i = 0; i < min(bar_list.length, color_list.length); i++) {
        fill(color_list[i]);
        let bar_size = bar_list[i] * bar_scale;
        rect(0, h_current, w, bar_size);
        h_current += bar_size;
    }
    //rect(0, 0, w, h);
    pop();
}