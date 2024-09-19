function setup() {
    createCanvas(1000, 600);
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
    dt = 0.01;
    img = loadImage("graphics/lander.png")
  }
  
  function draw() {
    background(0)
    x += vx*dt;
    y += vy*dt;
    image(img, x, y, 200, 200)
  }