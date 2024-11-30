/*
A file reserved for global utilities shared across applets
*/

function rms(a, b) { // fastest 2d root mean square according to current benchmarks, should be used everywhere
    return (a * a + b * b) ** 0.5;
}
function draw_arrow(x1, y1, x2, y2, color="white", sw=0.05) {
	let headsize = 5 * sw;
	let x = x1 - x2
	let y = y1 - y2;
	let len = rms(x, y)
	push();
	// draw line
	strokeWeight(sw);
	stroke(color);
	noFill();
	line(x1, y1, x2+headsize*x/len, y2+headsize*y/len);
	// draw arrowhead
	noStroke();
	fill(color);
	triangle(x2, y2,
		x2 + x*headsize/len + y*headsize/len/2, y2 + y*headsize/len - x*headsize/len/2,
		x2 + x*headsize/len - y*headsize/len/2, y2 + y*headsize/len + x*headsize/len/2
	)
	pop();
}

function draw_moment(x, y, r=0.5, color="white", sw=0.05) {
    if (r==0) { return }
    push();
    noFill();
    stroke(color);
    strokeWeight(sw);
    arc(x, y, r*2, r*2, -1.5*PI, 0);
    if (r>0) {
        draw_arrow(x+r, y+0.1, x+r, y+0.2, color, sw);

    }
    else {
        draw_arrow(x+0.1, y-r, x+0.2, y-r, color, sw);
    }
    pop();
}

function drawCurve(eq, start, end, diff, color="white", sw=0.05) {
	push();
	noFill();
    stroke(color);
    strokeWeight(sw);
	out = [];
	for (i=0; i< (end - start) / diff; i++) {
		out.push(eq(start + i * diff));
		if (out.length > 1) {
			line(out[i].x, out[i].y, out[i-1].x, out[i-1].y);
			console.log(out[i])
		}
	}
	
	pop();
}