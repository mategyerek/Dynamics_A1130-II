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
function draw_labeled_arrow(x1, y1, x2, y2, label, color="white", sw=0.05, label_offset=[0, 0.1], flip_label=true) {
    push()
    translate((x1 + x2) / 2 + label_offset[0], (y1 + y2) / 2 + label_offset[1])
    if (flip_label) {
        scale(1, -1)
    }
    fill(color)
    noStroke()
    text(label, 0, 0)
    pop()
    draw_arrow(x1, y1, x2, y2, color, sw)
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
function draw_stacked_bars(x, y, bar_list, color_list, label_list, w = 0.5, h = 2) {
    push();
    translate(x, y);
    noStroke()
    push();
    fill("white");
    scale(1, -1);
    text("Energy", -1, -h/2);
    fill(color_list[0]);
    text(label_list[0], w + 0.2, 0);
    fill(color_list[1]);
    text(label_list[1], w + 0.2, -h+0.13);
    point(0, 0);
    pop();
    if (bar_list.length != color_list.length) {
        console.warn("bar list and color list must have the same length");
        return;
    }
    let h_current = 0;
    let bar_scale = h / bar_list.reduce((a, b) => a + b);
    //console.log(bar_scale)
    for (i = 0; i < min(bar_list.length, color_list.length); i++) {
        fill(color_list[i]);
        let bar_size = bar_list[i] * bar_scale;
        rect(0, h_current, w, bar_size);
        h_current += bar_size;
    }
    //rect(0, 0, w, h);
    pop();
}