let truck;


function right_triangle(x, y, w, h) { //draw right triangle with right angle vertex centered at xy
  triangle(x, y, x, y + h, x - w, y);
}
function draw_truck(x, y, angle) { // utility function to draw truck
  push()
  translate(x, y)
  stroke('red')
  rotate(angle)
  
  point(0,0)
  push()
  translate(-rear_wheel_center.x, truck_h-rear_wheel_center.y);
  scale(1, -1)
  //image(truck, 0, 0, truck_w, truck_h)
  pop()
  stroke('green')
  point(0, 0)
  pop()
}

function preload() {
  truck = loadImage("/graphics/cybertruck.png");
  
}

function setup() {
  //user input [m]
  ramp_angle = radians(20);
  h = 0.4;
  d = 1.2;
  cx0 = 1.6;
  cy0 = 1.3;
  v_wheel = .4;

  // simulation variables
  dt = 0.01;
  t = 0;

  beta = 0.0; // current angle of truck
  omega = .1; // angular velocity of truck
  
  x_wheel = 3;



  // drawing variables
  canvas_width = 900 // [px]
  canvas_height = 600 // [px]
  pxpm = 50; // pixels per meter (reduce to zoom out)
  createCanvas(canvas_width, canvas_height);
  

  // calulate truck size
  rear_wheel_center = createVector(122.5, 30); // distance from rear corner of the truck image to rear wheel center ([px], [px])

  truck_w = cx0 + d + rear_wheel_center.x/pxpm; // [m]
  triangle_width = 2 // [m]

  truck_AR = truck.width / truck.height;
  imageScale = truck_w / truck.width;
  truck_h = imageScale * truck.height;
  truck_w = truck_AR * truck_h;
  rear_wheel_center.div(pxpm); // convert to m
  console.log(rear_wheel_center)
}
  
function draw() {
  x_wheel += v_wheel*dt
  beta += omega*dt

  background(255);
  translate(0, canvas_height) // move origin to bottom left
  scale(pxpm, -pxpm) // set scale to meter, flip y axis

  draw_truck(x_wheel, rear_wheel_center.y, beta)

  // draw triangle
  noStroke();
  fill(250,0,0,100)
  right_triangle(truck_w-rear_wheel_center.x+triangle_width, 0.7, triangle_width, triangle_width*tan(ramp_angle))

  // draw ground
  fill(100,100,100)
  //rect(0,0,canvas_width, 0.07)


  let A = createVector(x_wheel, 0)


  stroke('red')
  strokeWeight(.05);
  //point(A)
  // point(0 , 0)
  // point(0 , 1)
  // point(1 , 0)
  // point(1 , 1)
  // stroke('blue')
  
  // translate(2,2)
  // rotate(beta)
  // translate(-1,-1)

  // rect(0,0, 4, 3)
  // point(1,1)
}