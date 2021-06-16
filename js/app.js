$(document).ready(() => {
	$("header").load("../components/header.html");
	$("footer").load("../components/footer.html");
});

const width = 500;
const height = 500;

const fps = 60;
const delta = 1.0/fps;

let graph;

class Node {
	constructor(id) {
		this.id = id;
		this.x = width / 2;
		this.y = height / 2;
		this.z = 0;

		this.xTarget = this.x;
		this.yTarget = this.y;
		this.zTarget = this.z;

		this.xVel = 0;
		this.yVel = 0;
		this.zVel = 0;

		this.neighbors = [];
	}

	draw() {
		this.x += this.xVel;
		this.y += this.yVel;
		this.z += this.zVel;
		
		fill('red');
		ellipse(this.x, this.y, 20);

		this.neighbors.forEach(neighbor => {
			push();

			stroke(0);
			line(this.x, this.y, neighbor.x, neighbor.y);

			pop();
		});
	}

	addNeighbor(neighbor) {
		this.neighbors.push(neighbor);
	}

	// time is in seconds
	setTarget(x, y, z, time) {
		this.xTarget = x;
		this.yTarget = y;
		this.zTarget = z;

		this.xVel = delta*(this.xTarget - this.x) / time;
		this.yVel = delta*(this.yTarget - this.y) / time;
		this.zVel = delta*(this.zTarget - this.z) / time;
	}
}

class Graph {
	constructor(numNodes, spacing, numNeighbors=4, animationInterval=1) {
		this.numNodes = numNodes;
		this.nodes = [];
		this.lines = [];
		this.spacing = spacing;
		this.numNeighbors = numNeighbors;

		this.animationInterval = animationInterval;
		this.framesSinceAnimation = 0;
		
		this.angle = 0;

		for (let i = 0; i < numNodes; ++i) {
			this.nodes.push(new Node(i));
		}

		this.nodes.forEach(node => {
			for (let n = 0; n < this.numNeighbors; ++n) {
				let i = 0;
				// Make sure that we don't pair a node with ittself
				do {
					i = Math.floor(Math.random() * this.nodes.length);
				} while(i == node.id);

				node.addNeighbor(this.nodes[i]);
			}
		});

		this.randomize();
	}

	randomize() {
		// Normalize position to a grid excluding min edges
		let x, y, z;
		let minX = 1; 
		let minY = 1;
		let maxX = width / this.spacing;
		let maxY = height / this.spacing;
		for (let i = 0; i < this.numNodes; ++i) {
			x = Math.floor((Math.random()*(maxX - minX)) + minX) * this.spacing; 
			y = Math.floor((Math.random()*(maxY - minY)) + minY) * this.spacing;
			z = 0;

			this.nodes[i].setTarget(x, y, z, this.animationInterval);
		}

		this.framesSinceAnimation = 0;
	}

	draw() {
		this.angle += 30 * delta;
		if (this.framesSinceAnimation >= fps / this.animationInterval) {
			this.randomize();
		}

		// Visualize axis
		push();
		for (let x = 1; x < (width / this.spacing); x++) {
			stroke(0);
			line(x*this.spacing, 0, x*this.spacing, height);
		}
		for (let y = 1; y < (height / this.spacing); y++) {
			stroke(0);
			line(0, y*this.spacing, width, y*this.spacing);
		}
		pop();

		this.nodes.forEach(node => {
			node.draw();
		});

		this.framesSinceAnimation++;
	}
}

function setup() {
	let canvas = createCanvas(width, height);
	canvas.parent('canvas-target');

	graph = new Graph(15, 40, 4, 1);

	frameRate(fps);
	noStroke();
}

function draw() {
	background('#edf0f1');

	graph.draw();
}
