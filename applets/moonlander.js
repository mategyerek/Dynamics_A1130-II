// all units SI unless specified

// numerical variables
let yg;
let v;
let theta;
let omega;

let k;
let m;

let d;
let h;

let g;

// simulation parameters
let running = false;
let in_setup = true
let dt = 0.01;

// canvas parameters
pxpm = 50;
let canvas_height = 600;
let canvas_width = 900;

// buttons
let play_pause;
let reset;

// slider objects
let v0_slider;
let k_slider;
let m_slider;
let d_slider;
let h_slider;
let g_slider;

function preload() {
}

function setup() {
    // set up sliders and labels
	v0_slider = createSlider(0, 5, 1, 0.1)
	k_slider = createSlider(0, 5, 1, 0.1)
	m_slider = createSlider(0, 5, 1, 0.1)
	d_slider = createSlider(0, 5, 3, 0.1)
	h_slider = createSlider(0, 5, 2, 0.1)
	g_slider = createSlider(0, 5, 1, 0.1)
	update_sliders();
    // set up control buttonss
    play_pause = createSpan("play_circle");
    play_pause.addClass("material-icons");
    play_pause.addClass("icon-btn");
    play_pause.position(15, canvas_height-55);
    reset = createSpan("stop_circle");
    reset.addClass("material-icons");
    reset.addClass("icon-btn");
    reset.position(60, canvas_height-55);
    play_pause.mousePressed(toggle_loop);
    reset.mousePressed(reset_state);

    initial_state();
    createCanvas(canvas_width, canvas_height);
}

function draw() {

    if (running) {
        yg -= v*dt;
    }

    background(0);
    update_sliders();
    translate(0, canvas_height); // move origin to bottom left
    scale(pxpm, -pxpm); // set scale to meter, flip y axis
	let MIDDLE = width/pxpm/2

    // draw lander skeleton
	push();
	stroke("red");
	strokeWeight(0.1);
    translate(MIDDLE, yg)
	point(0, 0);
	rotate(theta);
	translate(0, -h);
	point(d/2, 0);
	point(-d/2, 0);
	pop();

}

function toggle_loop() {
    running = !running;
    in_setup = running ? false : in_setup;
    play_pause.html(running ? "pause_circle" : "play_circle");
}

function initial_state() {
    // set states to slider values
	yg = 5;
	v = v0_slider.value();
	k = k_slider.value();
	m = m_slider.value();
	d = d_slider.value();
	h = h_slider.value();
	g = g_slider.value();
    theta = -0.04;
}
function reset_state() {
    running = false;
    in_setup = true;
    play_pause.html("play_circle");
    initial_state();
}
function update_sliders(
    slider_list = [v0_slider, k_slider, m_slider, d_slider, h_slider, g_slider,],
    label_list = ["v", "k", "m", "d", "h", "g"],
    unit_list = ["m/s", "m", "kg", "m", "m", "m/s^2"],
    slider_spacing = 30
) {
    push()
    for ([i, slider] of slider_list.entries()) {
        let pos_y = 20 + i*slider_spacing;
        let label_text = label_list[i];
        slider.position(canvas_width-200, pos_y);
        fill("#FFFFFF");
        textSize(15);
        text(`${label_text} = ${slider.value()} ${unit_list[i]}`, canvas_width-285, pos_y+17);
    }
    pop()
}