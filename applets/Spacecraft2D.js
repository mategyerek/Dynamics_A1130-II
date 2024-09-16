let spacecraftSize = 100

function setup() {
    createCanvas(1000, 600);
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
    dt = 0.01;
    img = loadImage("applets/lander.png")
  }

  function updateScreen() {
    background(0);
    image(img,x,y,spacecraftSize,spacecraftSize)
  }