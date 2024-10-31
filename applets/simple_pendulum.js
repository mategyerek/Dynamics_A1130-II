// Everything in SI unless specified otherwise
// Physical variables
let g; //gravitational acceleration
let l; //pendulum length
let E_sys; //system total energy
let h; //current height from bottom point
let theta; //angle from vertical
let v; //speed of pendulum

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
let E_slider;
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
    g_slider = createSlider(1,25,9.8,0.1);
    l_slider = createSlider(0.5,min(drawing_height/2/pxpm-0.5,drawing_width/2/pxpm-0.5),1,0.1);
    E_slider = createSlider(0.2,20,1,0.2);
    theta_slider = createSlider(0,180,5);
    v_slider = createSlider(0,5,0,0.1);

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
}

function update_sliders(
    slider_list = [g_slider,l_slider,E_slider,theta_slider,v_slider],
    label_list = ['g','l','E','theta','v'],
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
    //todo
}

function draw() {
    background(0);
    update_sliders();

    push();
    fill(sp_color);
    stroke(sp_color);
    rect(drawing_width,0,sp_width,sp_height);
    pop();
}
