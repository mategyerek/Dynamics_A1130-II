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
const m = 2700;
const k = 1.45
// helper constants
const Ig = k ** 2 * m;
const g = 9.81;
const W = m * g;

// static geometry based on user input
const AB = rms(cx0 + d, h);
const AG = rms(cx0, cy0);


// truck state
let beta;
let gamma;
let delta;
let R;
let omega;
let alpha;
let ax;
let ay;
// helper variables
let k1;
let u1;
let IC_x;
let IC_y;


// simulation parameters
let t;
const dt = 0.00001;

// drawing variables
let canvas_width = 900; // [px]
let canvas_height = 600; // [px]
let pxpm = 100; // pixels per meter (reduce to zoom out)
let ramp_length = 5;


// helper functions
function right_triangle(x, y, w, h) { // draw right triangle with right angle vertex centered at xy
    push();
    noStroke();
    fill(255, 0, 0, 70);
    triangle(x, y, x, y + h, x - w, y);
    pop();
}
function truck_skeleton() { // starting with rearwheel at 0, 0
    push();
    stroke("blue");
    point(0, 0); // rear wheel ground contact
    point(d + cx0, h); // bumper contact
    point(cx0, cy0); // CoM
    pop();
}

// P5js stuff
function preload() {

}

function setup() {
    createCanvas(canvas_width, canvas_height);

    // initial truck state
    beta = atan(h / (cx0 + d));
    gamma = atan(cy0 / cx0);
    delta = 0; // truck floor with repect to ground level
    IC_x = 0;
    R = AB * cos(beta) / sin(ramp_angle);
    omega = v_b0 / R;
    t = 0;
    k1 = AB / tan(ramp_angle) * cos(beta) + AB * sin(beta) - AG * sin(gamma);
    u1 = AB / tan(ramp_angle) * sin(beta) - AB * cos(beta) + AG * cos(gamma);
    // ax = ( k1/Ig * ( C + B*AG*cos(gamma)*C/(Ig-AG*cos(gamma)*B) ) - u1*omega**2) / ( 1 - k1*A/Ig - B*AG*cos(gamma)*A/(Ig - AG*cos(gamma)*B) );
    // ay = AG * cos(gamma) * (A * ax + C) / (Ig - AG * cos(gamma) * B);
    // alpha = A * ax + B * ay + C;

    // some impossible to debug lines
    alpha = -(((-cx0)*m*omega**2*u1*cos(ramp_angle)-d*m*omega**2*u1*cos(ramp_angle)+cy0*omega**2*u1*sin(ramp_angle)-h*omega**2*u1*sin(ramp_angle)+cx0*W*sin(ramp_angle)+AG*d*omega**2*sin(gamma)*sin(ramp_angle)-AG*cx0*m*omega**2*sin(gamma)*sin(ramp_angle)-AG*d*m*omega**2*sin(gamma)*sin(ramp_angle))/(cx0*k1*m*cos(ramp_angle)+d*k1*m*cos(ramp_angle)+Ig*sin(ramp_angle)-cy0*k1*sin(ramp_angle)+h*k1*sin(ramp_angle)-AG*d*cos(gamma)*sin(ramp_angle)+AG*cx0*m*cos(gamma)*sin(ramp_angle) + AG*d*m*cos(gamma)*sin(ramp_angle)));
    ax = -((Ig*omega**2*u1*sin(ramp_angle) + cx0*k1*W*sin(ramp_angle) - AG*d*omega**2*u1*cos(gamma)*sin(ramp_angle) + AG*cx0*m*omega**2*u1*cos(gamma)*sin(ramp_angle) + AG*d*m*omega**2*u1*cos(gamma)*sin(ramp_angle) + AG*d*k1*omega**2*sin(gamma)*sin(ramp_angle) - AG*cx0*k1*m*omega**2*sin(gamma)*sin(ramp_angle) - AG*d*k1*m*omega**2*sin(gamma)*sin(ramp_angle))/(cx0*k1*m*cos(ramp_angle) + d*k1*m*cos(ramp_angle) + Ig*sin(ramp_angle) - cy0*k1*sin(ramp_angle) + h*k1*sin(ramp_angle) - AG*d*cos(gamma)*sin(ramp_angle) + AG*cx0*m*cos(gamma)*sin(ramp_angle) + AG*d*m*cos(gamma)*sin(ramp_angle)));
    ay = -(((-AG)*cx0*m*omega^2*u1*cos(gamma)*cos(ramp_angle) - AG*d*m*omega^2*u1*cos(gamma)*cos(ramp_angle) + AG*cx0*k1*m*omega^2*cos(ramp_angle)*sin(gamma) + AG*d*k1*m*omega^2*cos(ramp_angle)*sin(gamma) + AG*cy0*omega^2*u1*cos(gamma)*sin(ramp_angle) - AG*h*omega^2*u1*cos(gamma)*sin(ramp_angle) + AG*cx0*W*cos(gamma)*sin(ramp_angle) + AG*Ig*omega^2*sin(gamma)*sin(ramp_angle) - AG*cy0*k1*omega^2*sin(gamma)*sin(ramp_angle) + AG*h*k1*omega^2*sin(gamma)*sin(ramp_angle))/(cx0*k1*m*cos(ramp_angle) + d*k1*m*cos(ramp_angle) + Ig*sin(ramp_angle) - cy0*k1*sin(ramp_angle) + h*k1*sin(ramp_angle) - AG*d*cos(gamma)*sin(ramp_angle) + AG*cx0*m*cos(gamma)*sin(ramp_angle) + AG*d*m*cos(gamma)*sin(ramp_angle)));

    console.log(omega); // correct
    console.log(alpha); // incorrect wrt answer key should be -0.283
    console.log(ax); // incorrect wrt answer key should be -1.82
    console.log(ay); // incorrect wrt answer key should be -1.69
}

function draw() {
    // truck state
    beta += omega * dt;
    gamma += omega * dt;
    delta += omega * dt; // truck floor with repect to ground level
    R = AB * cos(beta) / sin(ramp_angle);
    // omega = v_b0 / R; // should be changed
    alpha = -(((-cx0)*m*omega**2*u1*cos(ramp_angle)-d*m*omega**2*u1*cos(ramp_angle)+cy0*omega**2*u1*sin(ramp_angle)-h*omega**2*u1*sin(ramp_angle)+cx0*W*sin(ramp_angle)+AG*d*omega**2*sin(gamma)*sin(ramp_angle)-AG*cx0*m*omega**2*sin(gamma)*sin(ramp_angle)-AG*d*m*omega**2*sin(gamma)*sin(ramp_angle))/(cx0*k1*m*cos(ramp_angle)+d*k1*m*cos(ramp_angle)+Ig*sin(ramp_angle)-cy0*k1*sin(ramp_angle)+h*k1*sin(ramp_angle)-AG*d*cos(gamma)*sin(ramp_angle)+AG*cx0*m*cos(gamma)*sin(ramp_angle) + AG*d*m*cos(gamma)*sin(ramp_angle)));

    omega += alpha * dt;

    // helper variables
    IC_y = AB * sin(beta) + R * cos(ramp_angle); // contrary to the drawing, this is with repect to point A (y1 + y2)
    IC_x += IC_y * omega * dt; // contrary to the drawing, in global coordinate system
    k1 = AB / tan(ramp_angle) * cos(beta) + AB * sin(beta) - AG * sin(gamma);
    u1 = AB / tan(ramp_angle) * sin(beta) - AB * cos(beta) + AG * cos(gamma);
    t += dt;

    // set up drawing
    background(240);
    translate(50, canvas_height); // move origin to bottom left and leave 50 padding
    scale(pxpm, -pxpm); // set scale to meter, flip y axis

    // draw ramp
    let ramp_offset_x = cx0 + d + ramp_length * cos(ramp_angle);
    right_triangle(ramp_offset_x, h, ramp_length * cos(ramp_angle), ramp_length * sin(ramp_angle));

    // draw truck
    push();
    translate(IC_x, 0);
    rotate(delta);
    truck_skeleton();
    pop();

    // IC visualization
    stroke("green");
    strokeWeight(0.01);
    reference_point = createVector(d + cx0 + t * v_b0 * cos(ramp_angle), h + t * v_b0 * sin(ramp_angle)); // expected movement of bumper initially
    line(IC_x, 0, IC_x, IC_y);
    line(reference_point.x, reference_point.y, reference_point.x - R * sin(ramp_angle), reference_point.y + R * cos(ramp_angle));
    stroke("red");
    strokeWeight(0.1);
    point(IC_x, IC_y);

    // restart if went over
    if (IC_x > (cx0 + d)) {
        setup();
    }
}