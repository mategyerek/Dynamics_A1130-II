// all units SI unless specified

// numerical variables
let yg;
let xg;
let vy;
let vx;
let theta;
let omega;
let E_kin;

let k;
let m;

let d;
let h;
let R;
let beta;

let g;

// simulation parameters
let running = false;
let in_setup = true;
let state = 0;
let prev_state = 0;
let dt = 0.005;

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
	v0_slider = createSlider(0, 5, 3, 0.1);
	k_slider = createSlider(0, 5, 1, 0.1);
	m_slider = createSlider(0, 5, 1, 0.1);
	d_slider = createSlider(0, 10, 8, 0.1);
	h_slider = createSlider(0, 8, 3, 0.1);
	g_slider = createSlider(0, 5, 1, 0.1);
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
    console.log(state);
    if (in_setup) {
        initial_state();
    }
    if (running) {
        switch (state) {
        case 0:
            yg += vy*dt;
            if (yg-h*cos(theta)+d/2*sin(theta) < 0) {
                state = 1;
            }
            break
        case 1:
            let v1 = d/2/R*vy;
            vy = v1*d/2/R;
            vx = v1*h/R;
            console.log(vx);
            omega = rms(vx, vy)/R;
            state = 2;
            break
        case 2:
            theta += omega*dt;
            yg += vy*dt;
            xg += vx*dt;
            if (yg-h*cos(theta)-d/2*sin(theta) < 0) {
                state = 3;
            }
            break
        case 3:
            let v2 = d/2/R*vy;
            vy = -v2*d/2/R;
            vx = v2*h/R;
            omega = rms(vx, vy)/R;
            state = 4;
            break
        case 4:
            // some numerical? problems with tan! should be imroved
            if ((yg <= h && vy < 0) || abs(beta + theta + 0.1) >= PI/2) {
                state = 5;
            }
            vy -= g*dt;
            vx = -tan(beta + theta)*vy;
            xg += vx*dt;
            yg += vy*dt;
            omega = rms(vx, vy)/R*abs(vy)/vy;
            theta += omega*dt;
            break;
        case 5: // end
            toggle_loop();
        }

        if (state != prev_state) { // pause on state change
            prev_state = state;
            toggle_loop();
        } 
    }

    background(0);
    update_sliders();
    translate(0, canvas_height); // move origin to bottom left
    scale(pxpm, -pxpm); // set scale to meter, flip y axis
	

    // draw lander skeleton
	push();
	stroke("red");
	strokeWeight(0.1);
    translate(xg, yg);
	point(0, 0);
    draw_arrow(0, 0, 0, vy, "green");
    draw_arrow(0, 0, vx, 0, "green");
    draw_arrow(0, 0, vx, vy, "lightgreen");
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
    let MIDDLE = canvas_width/pxpm/2;
    state = 0;
    prev_state = 0;
	yg = 5;
    xg = MIDDLE;
	vy = -v0_slider.value();
    vx = 0;
	k = k_slider.value();
	m = m_slider.value();
	d = d_slider.value();
	h = h_slider.value();
	g = g_slider.value();
    theta = -0.02;
    beta = atan(h / (d/2))
    R = rms(d/2, h);
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