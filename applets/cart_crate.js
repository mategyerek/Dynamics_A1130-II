let m_slider;
let a_slider;
let mu_slider;
let h_slider;
let w_slider;
let mode_selector;
let message;

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
let theta = 0;
let omega = 0;
let alpha = 0.2; // controls tipping speed

let slipping = false;
let tipping = false;
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
    mu_slider = createSlider(0, 2, 0.5, 0.01);
	h_slider = createSlider(0.5, 10, 5, 0.1);
	w_slider = createSlider(0.2, 5, 2, 0.1);
	mode_selector = createSelect();
	mode_selector.position(20, 15)
	mode_selector.option("force pair");
	mode_selector.option("resultant force and moment");
	mode_selector.option("resultant force");
	play_pause = createSpan("play_circle");
    play_pause.addClass("material-icons");
    play_pause.addClass("icon-btn");
    play_pause.position(15, canvas_height-55);
	play_pause.mousePressed(toggle_loop);
	reset = createSpan("stop_circle");
    reset.addClass("material-icons");
    reset.addClass("icon-btn");
    reset.position(60, canvas_height-55);
	reset.mousePressed(initial_state);


    update_sliders();
	initial_state()
	createCanvas(canvas_width, canvas_height);
	disp_mode = 2;
}


function draw() {
	if (in_setup) {
		a = a_slider.value();
		m = m_slider.value();
		h = h_slider.value();
		w = w_slider.value();
		mu = mu_slider.value();
		x_crate = x + (cart_w - w) / 2;
	}
	
	let arrowscale = 0.07/(log(m+1));
	let ff;
	let ff_slip;
	let ff_noslip = m*a; // no slip

	if (a > 0) {
		ff_slip = mu*m*g
	}
	else if (a < 0) {
		ff_slip = -mu*m*g
	}
	else {
		ff_slip = 0;
	}
	if (abs(ff_noslip) > abs(ff_slip)) {
		ff = ff_slip;
		slipping = true;
	}
	else {
		ff = ff_noslip;
		slipping = false;
	}

	let M = -ff*h/2
	let r2 = m*g/2+M/w;
	let r1 = m*g/2-M/w;
	let arrow_offset = -a / g * h/2;
	if (r1 <= 0 || r2 <= 0) {
		tipping = true;
		r1 = max(r1, 0);
		r2 = max(r2, 0);
		arrow_offset = arrow_offset/abs(arrow_offset) * w/2;
	}
	else {
		tipping = false;
	}

	
	if (running) {
		v += a * dt;
		x += v * dt;

		v_crate += ff / m * dt;
		x_crate += v_crate * dt;

		if (tipping) {
			omega += a*alpha*dt;
			theta += omega*dt;
			if (theta > PI/2) {
				theta = PI / 2;
			}
			if (theta < -PI/2) {
				theta = -PI / 2;
			}
		}
		
	}
	
	
	background(0);
	update_sliders();
	update_info();
	translate(0, canvas_height)
	scale(pxpm, -pxpm)
	noStroke()
	
	push()
	translate(x, cart_h);
	scale(1,-1);
	image(transporter, 0, 0, cart_w, cart_h);
	pop()
	
	push()
	if (theta >= 0) {
		translate(x_crate, cart_h);
		rotate(theta)
		translate(0, h)
		push();
		scale(1, -1)
		image(superheavy, 0, 0, w, h);
		pop();
	}
	else {
		translate(x_crate+w, cart_h);
		rotate(theta)
		translate(-w, h);
		push();
		scale(1, -1)
		image(superheavy, 0, 0, w, h);
		pop();
	}
	translate(w/2, -h/2)
	let imsize = 0.5
	image(cg, -imsize/2, -imsize/2, imsize, imsize)
	pop()

	// turn off forces when running
	if (!running){
		// gravity
		let x_cg;
		if (theta > 0) {
			x_cg = x_crate - h/2*sin(theta) + w/2*cos(theta);
		}
		else {
			x_cg = x_crate - h/2*sin(theta) - w/2*cos(theta) + w;
		}
		let y_cg = cart_h + w/2 * abs(sin(theta)) + h/2 *cos(theta);
		draw_arrow(x_cg, y_cg + m*g*arrowscale, x_cg, y_cg, "white")
		// inertial force(s)
		draw_arrow(x_cg, y_cg, x_cg + a*m*arrowscale, y_cg, "lightgreen")

		// friction
		if (!tipping) {
			draw_arrow(x_crate + w/2, cart_h-0.01, x_crate + w/2 + ff * arrowscale, cart_h-0.01, slipping ? "orange" : "yellow")
		}
		else {
			draw_arrow(x_crate + w/2 + arrow_offset, cart_h-0.01, x_crate + w/2 + arrow_offset + ff * arrowscale, cart_h-0.01, slipping ? "orange" : "yellow")
		}

		
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
				
				draw_arrow(x_crate, cart_h, x_crate, cart_h + r1*arrowscale, "red", 0.06);
				draw_arrow(x_crate + w, cart_h, x_crate + w, cart_h + r2*arrowscale, "red", 0.06);
				break;
			case "resultant force":
				// sliding arrow
				draw_arrow(x_crate + w/2 + arrow_offset, cart_h, x_crate + w/2 + arrow_offset, cart_h + m*g*arrowscale, "red", 0.06);
				break;
		}
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
	theta = 0;
	omega = 0;
	running = false;
	in_setup = true;
	play_pause.html("play_circle");
}

function update_sliders(
    slider_list = [m_slider, mu_slider, h_slider, w_slider, a_slider],
    label_list = ["m", "mu", "h", "w", "a"],
    // unit_list = ["kg", "", "m", "m", "m/s^2"],
    slider_spacing = 30
) {
    push()
    for ([i, slider] of slider_list.entries()) {
        let pos_y = 20 + i*slider_spacing
        let label_text = label_list[i]
        slider.position(canvas_width-200, pos_y)
        fill("#FFFFFF")
        textSize(15)
        text(`${label_text} = ${slider.value()}`, canvas_width-290, pos_y+17)
    }
    pop()
}

function toggle_loop() {
	in_setup = false;
    running = !running;
    play_pause.html(running ? "pause_circle" : "play_circle");
}
function update_info() {
	push();
	textSize(20);
	fill("white");
	if (tipping) {
		message = text("Tipping", 650, 200);
	}
	else if (slipping) {
		message = text("Slipping", 650, 200);
	}
	else {
		message = text("");
	}
	pop();
}