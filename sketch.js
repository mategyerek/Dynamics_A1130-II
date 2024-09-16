

function setup() {
  createCanvas(1000, 600);
  img = loadImage("image.png")
  let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
let dt = 0.01
}

function draw() {
  background(0)
  x += vx*dt;
  y += vy*dt;
  image(img, x, y, 200, 200)
}