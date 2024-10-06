/*
Applet for simulating problem 17-106 form the dynamics book (14th edition)
Everything in SI unless otherwise specified. For explanation of variables see: notes/p17-106.png
*/

// user input
const ramp_angle = 20 / 180 * Math.PI;
const h = 0.4;
const d = 1.2;
const cx0 = 1.6;
const cy0 = 1.3;
const v_b0 = 8; // bumper velocity

// static geometry based on user input
const AB = rms(cx0 + d, h);


// truck state
let beta;
let delta;
let R;
let omega;
// helper variables
let IC_x;
let IC_y;


// simulation variables
let t;
const dt = 0.0006;

// drawing variables
let canvas_width = 900; // [px]
let canvas_height = 600; // [px]
let pxpm = 70; // pixels per meter (reduce to zoom out)


// helper functions

function right_triangle(x, y, w, h) { // draw right triangle with right angle vertex centered at xy
    push()
    noStroke()
    fill(255, 0, 0, 70)
    triangle(x, y, x, y + h, x - w, y);
    pop()
}
function truck_skeleton() { // starting with rearwheel at 0, 0
    push()
    stroke("blue");
    point(0, 0); // rear wheel ground contact
    point(d + cx0, h); // bumper contact
    point(cx0, cy0); // CoM
    pop()
}

// P5js stuff
function preload() {

}

function setup() {
    createCanvas(canvas_width, canvas_height);
    reference_point = createVector(d+cx0 + t*v_b0*cos(ramp_angle), h+ t*v_b0*sin(ramp_angle))
    // initial truck state
    beta = atan(h / (cx0 + d));
    delta = 0; // truck floor with repect to ground level
    R = AB * cos(beta) / sin(ramp_angle);
    omega = v_b0 / R;
    // helper variables;
    IC_x = 0;
    IC_y = AB * sin(beta) + R * cos(ramp_angle); // contrary to the drawing, this is with repect to point A (y1 + y2)
    t = 0;
    console.log(omega)
}

function draw() {

    delta += omega*dt; // truck floor with repect to ground level
    beta += omega*dt;
    R = AB * cos(beta) / sin(ramp_angle);
    omega = v_b0 / R;
    // helper variables;
    IC_x += IC_y*omega*dt; // contrary to the drawing, in global coordinate system
    IC_y = AB * sin(beta) + R * cos(ramp_angle); // contrary to the drawing, this is with repect to point A (y1 + y2)   
    
    t += dt
    //console.log(omega) 
    background(240);
    translate(50, canvas_height); // move origin to bottom left and leave 50 padding
    scale(pxpm, -pxpm); // set scale to meter, flip y axis

    stroke("green");
    strokeWeight(0.1);
    let ramp_offset_x = 1.7
    let ramp_length = 3
    reference_point = createVector(d+cx0 + t*v_b0*cos(ramp_angle), h+ t*v_b0*sin(ramp_angle))
    point(reference_point); // expected movement of bumper initially
    right_triangle(ramp_offset_x+ramp_length, 0, ramp_length*cos(ramp_angle), ramp_length*sin(ramp_angle));

    // draw truck skeleton
    
    push()
    translate(IC_x, 0);
    rotate(delta);
    truck_skeleton();
    pop()
    // ic lines
    
    strokeWeight(0.01)

    //line(IC_x, 0, IC_x, IC_y);
    //line(reference_point.x, reference_point.y, reference_point.x-R*sin(ramp_angle), reference_point.y+R*cos(ramp_angle))
    noFill()
    //circle(reference_point.x, reference_point.y, 2*R)
    stroke("red")
    strokeWeight(0.1)
    point(IC_x, IC_y)
    if (IC_x>20) {
        setup()
    }
}