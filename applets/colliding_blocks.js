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
let I1;
let I2;
let E1;
let E2;
let E_total;

// simulation parameters
let running = false;
let in_setup = true
let dt = 0.01;

// canvas parameters
let pxpm = 55;
let canvas_height = 600;
let canvas_width = 900;
let sp_width = 300;
let h_bottom = 50;

// buttons
let play_pause;
let reset;

// slider objects
let m1_slider;
let m2_slider;
let x1_0;
let x2_0;
let v1_slider;
let v2_slider;
let e_slider;

function preload() {
}

function setup() {
    // set up sliders and labels
    m1_slider = createSlider(0.1, 5, 2, 0.1)
    m2_slider = createSlider(0.1, 5, 10, 0.1)
    x1_0 = 2
    x2_0 = -2
    v1_slider = createSlider(-5, 0, -3, 0.1)
    v2_slider = createSlider(0, 5, 3, 0.1)
    e_slider = createSlider(0, 1, 1, 0.05)
    update_sliders()
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
        if ((x1 + w1) > ((width-sp_width) / 2 / pxpm) || (x2 - w1) < -((width-sp_width) / 2 / pxpm)) {
            running = false
            play_pause.html("play_circle")
        }
        else {
            if (x1 < x2 && v1 - v2 <= 0) {
                //console.log(v1, v2, m1, m2)
                console.log("collision")

                let temp_v1 = (m1 * v1 + m2 * v2 + e * m2 * abs(v1 - v2)) / (m1 + m2)
                v2 = (m1 * v1 + m2 * v2 - m1 * temp_v1) / m2
                v1 = temp_v1
                //does not satisfy conservation of energy
                //let temp = (m1*v1 + m2*(e*(v2 - v1) + v2)) / (m1 + m2)
                //v2 = (m2*v2 + m1*(e*v1 + v1 - e*v2)) / (m1 + m2)
                //v1 = temp
            }
            
            x1 += v1*dt
            x2 += v2*dt
        }
    }
    if (in_setup) {
        initial_state()
    }
    I1 = m1 * v1
    I2 = m2 * v2
    E1 = 0.5 * m1 * v1 * v1
    E2 = 0.5 * m2 * v2 * v2
    E_total = E1 + E2

    background(0)
    draw_background()
    update_sliders()
    translate((canvas_width-sp_width)/2, canvas_height); // move origin to bottom center
    scale(pxpm, -pxpm); // set scale to meter, flip y axis

    
    strokeWeight(0.03)
    textSize(0.3)
    stroke("#C9E2AE")
    fill("#83C167")
    square(x1, (h_bottom+1)/pxpm, w1)

    stroke("#5CD0B3")
    fill("#49A88F")
    rect(x2, (h_bottom+1)/pxpm, -w2, w2)
    
    let I_scale = 0.2;
    let arrow_spacing = 0.7
    push()
    translate(0, 9)
    draw_labeled_arrow(0, 0, I1 * I_scale, 0, "I1", "#83C167")
    draw_labeled_arrow(I1 * I_scale, -arrow_spacing, (I1 + I2) * I_scale, -arrow_spacing, "I2", "#49A88F")
    draw_labeled_arrow(0, -2*arrow_spacing, (I1+I2) * I_scale, -2*arrow_spacing, "I1 + I2", "white", 0.05, [-0.5, 0.1])
    pop()
    draw_stacked_bars(7.5, 1, [E1, E2], ["#83C167", "#49A88F"], ["E1", "E2"], 2, E_total/20)
}

function toggle_loop() {
    running = !running
    in_setup = running ? false : in_setup
    play_pause.html(running ? "pause_circle" : "play_circle")
}

function initial_state() {
    m1 = m1_slider.value();
    m2 = m2_slider.value();
    x1 = x1_0
    x2 = x2_0
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
function update_sliders(
    slider_list = [m1_slider, m2_slider, v1_slider, v2_slider, e_slider],
    label_list = ["m1", "m2", "v1", "v2", "e"],
    unit_list = ["kg", "kg", "m/s", "m/s", ""],
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
function draw_background(n = 1, r1 = -8, r2 = 7) {
    push()
    textSize(12)
    stroke(100);  // white color for the axis
    strokeWeight(1);
    
    // Draw the main horizontal axis
    let width2 = 600
    centerX = width2 / 2
    let h1 = height-h_bottom;
    line(0, h1, width2, h1);
    fill(100);
    triangle(width2, h1, width2-10, h1-5, width2-10, h1+5)
    // Add labels every n units along the x-axis
    for (let x = r1; x <= r2; x += n) {
        push()
            translate(centerX, 0)
            strokeWeight(x == 0 ? 2 : 1);
            let tick_len = x == 0 ? 8 : 4
            line(x*pxpm, h1 - tick_len, x*pxpm, h1 + tick_len);  // small ticks for each label
            push()
                noStroke();
                textAlign(CENTER, TOP);
                text(x, x*pxpm, h1 + 20);  // display the x-coordinate as a label
            pop()
        pop()
    }
    fill("#222222")
    noStroke()
    //strokeWeight(102)
    //point(0,0)
    rect(width-sp_width,0,sp_width,height)
    pop()
    
}