$(document).ready(() => {
	$("header").load("../components/header.html");
});

const fps = 60;
const delta = 1.0/fps;

class Node {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Graph {
	constructor(numNodes) {
		this.numNodes = numNodes;
		this.nodes = [];
		this.lines = [];
		this.angle = 0;
	}

	draw() {
		this.angle += 30 * delta;

	}
}

function setup() {
	let canvas = createCanvas(500, 500);
	canvas.parent('canvas-target');

	frameRate(fps);
	noStroke();
}

function draw() {
	background(255);

	fill('red');
	rect(0, 0, 50, 50);
}
