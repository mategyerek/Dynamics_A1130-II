

function f(theta) {
	return createVector(cos(theta) + theta / 10, sin(theta) + theta / 10);
}

function setup() {
	createCanvas(600, 600)
}
function draw() {
	background(0);
	translate(300, 300);
	scale(100, 100);
	stroke("white");
	strokeWeight(0.01);
	drawCurve(f, 0, 2*PI, 0.1);

}