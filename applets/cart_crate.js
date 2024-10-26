let m_slider;
let a_slider;
let mu_slider;
let h_slider;
let w_slider;
let mode_selector;

let cg;

let m;
let a;
let mu;
let h;
let w;

let cart_h = 1.5;
let cart_w = 6;
let x;
let v;
let x_crate;
let v_crate;

let sliding = false;
let M;

let g = 9.81;

let pxpm = 50;
let canvas_height = 600
let canvas_width = 900

let running = false;
let in_setup = true;
let dt = 0.01;

function preload() {
	cg = loadImage("graphics/cg.png");
	superheavy = loadImage("graphics/superheavy.png");
	transporter = loadImage("graphics/transporter.png");
}

function setup() {
	m_slider = createSlider(0.1, 10, 1, 0.1);
    a_slider = createSlider(-10, 10, 0, 0.1);
    mu_slider = createSlider(0, 3, 1, 0.1);
	h_slider = createSlider(0.5, 10, 5, 0.1);
	w_slider = createSlider(0.2, 5, 2, 0.1);
	mode_selector = createSelect();
	mode_selector.position(20, 15)
	mode_selector.option("resultant force and moment");
	mode_selector.option("force pair");
	mode_selector.option("resultant force");
	play_pause = createSpan("play_circle");
    play_pause.addClass("material-icons");
    play_pause.addClass("icon-btn");
    play_pause.position(20, canvas_height-55)
	play_pause.mousePressed(toggle_loop)

    update_sliders();
	initial_state()
	createCanvas(canvas_width, canvas_height);
	disp_mode = 2;
}


function draw() {
	a = a_slider.value();
	m = m_slider.value();
	let arrowscale = 0.07/(log(m+1));
	h = h_slider.value();
	w = w_slider.value();
	mu = mu_slider.value();

	let ff = m * a;
	let ff_max = mu * m * g;
	if (abs(ff) > ff_max) {
		ff = ff_max * ff/abs(ff);
		sliding = true;
	}
	else {sliding = false}
	let M = -ff*h/2
	let r1 = (m*g-M/w)/2;
	let r2 = (m*g+M/w)/2;
	let arrow_offset = -ff*h/2/(m*g);

	if (running) {
		v += a * dt;
		x += v * dt;

		v_crate += ff/m*dt;
		x_crate += v_crate*dt;
		
	}
	
	
	background(0);
	update_sliders()
	translate(0, canvas_height)
	scale(pxpm, -pxpm)
	noStroke()
	
	push()
	translate(x, cart_h);
	scale(1,-1);
	image(transporter, 0, 0, cart_w, cart_h);
	pop()
	
	push()
	translate(x_crate, cart_h+h);
	scale(1, -1)
	image(superheavy, 0, 0, w, h);
	pop()

	let imsize = 0.5
	image(cg, x_crate+w/2-imsize/2, cart_h+h/2-imsize/2, imsize, imsize)

	// gravity
	draw_arrow(x_crate + w/2, cart_h + h/2 +  m*g*arrowscale, x_crate + w/2, cart_h + h/2, "white")

	// friction
	draw_arrow(x_crate + w/2, cart_h-0.01, x_crate + w/2 + ff * arrowscale, cart_h-0.01, sliding ? "orange" : "yellow")

	
	// options
	switch (mode_selector.value()) {
		case "resultant force and moment":
			// resultant force and moment
			if (M != 0) {
				draw_moment(x_crate + w/2, cart_h + h/2, 0.5*M*arrowscale, "red")
			}
			draw_arrow(x_crate + w/2, cart_h, x_crate + w/2, cart_h + m*g*arrowscale, "red", 0.06);
			break;
		case "force pair":
			// corner arrows
			
			draw_arrow(x_crate, cart_h, x_crate, cart_h + r1*arrowscale, "green", 0.06);
			draw_arrow(x_crate + w, cart_h, x_crate + w, cart_h + r2*arrowscale, "green", 0.06);
			console.log(r1)
			break;
		case "resultant force":
			// sliding arrow
			draw_arrow(x_crate + w/2 + arrow_offset, cart_h, x_crate + w/2 + arrow_offset, cart_h + m*g*arrowscale, "pink", 0.06);
			break;
	}

	
	

}

function initial_state() {
	m = m_slider.value();
	mu = mu_slider.value();
	h = h_slider.value();
	w = w_slider.value();
	x = (canvas_width / pxpm - cart_w) / 2;
	x_crate = x + (cart_w - w) / 2;
	v_crate = 0;
	v = 0;
}

function update_sliders(
    slider_list = [m_slider, a_slider, mu_slider, h_slider, w_slider],
    label_list = ["m", "a", "mu", "h", "w"],
    unit_list = ["kg", "m/s", "", "m", "m"],
    slider_spacing = 30
) {
    push()
    for ([i, slider] of slider_list.entries()) {
        let pos_y = 20 + i*slider_spacing
        let label_text = label_list[i]
        slider.position(canvas_width-200, pos_y)
        fill("#FFFFFF")
        textSize(15)
        text(`${label_text} = ${slider.value()} ${unit_list[i]}`, canvas_width-285, pos_y+17)
    }
    pop()
}

function toggle_loop() {
    running = !running
    play_pause.html(running ? "pause_circle" : "play_circle")
}