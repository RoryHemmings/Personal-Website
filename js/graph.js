const fps = 60;
const delta = 1.0/fps;

const zoomConstant = 700;

let graph;

class Node {
	constructor(id) {
		this.id = id;
		this.radius = 0.03*width;
		this.x = 0;
		this.y = 0;
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
		
		// ellipse(this.x, this.y, 20);
		push();

		// fill('red');
		specularMaterial(255, 255, 255);
		translate(this.x, this.y, this.z);
		sphere(this.radius); 

		pop();

		this.neighbors.forEach(neighbor => {
			push();

			stroke(0);
			line(this.x, this.y, this.z, neighbor.x, neighbor.y, neighbor.z);

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
		let minZ = 1;
		let maxX = width / this.spacing;
		let maxY = height / this.spacing;
		let maxZ = depth / this.spacing;
		for (let i = 0; i < this.numNodes; ++i) {
			x = (Math.floor((Math.random()*(maxX - minX)) + minX) * this.spacing) - Math.floor(width/2); 
			y = (Math.floor((Math.random()*(maxY - minY)) + minY) * this.spacing) - Math.floor(height/2);
			z = (Math.floor((Math.random()*(maxZ - minZ)) + minZ) * this.spacing) - Math.floor(depth/2);

			this.nodes[i].setTarget(x, y, z, this.animationInterval);
		}

		this.framesSinceAnimation = 0;
	}

	draw() {
		rotateY(this.angle);
		if (this.framesSinceAnimation >= (fps * this.animationInterval)) {
			this.randomize();
		}

		// Visualize axis
		// push();
		// for (let x = 1; x < (width / this.spacing); x++) {
		// 	stroke(0);
		// 	line(x*this.spacing - width/2, -(height/2), x*this.spacing - width/2, height);
		// }
		// for (let y = 1; y < (height / this.spacing); y++) {
		// 	stroke(0);
		// 	line(-(width/2), y*this.spacing - height / 2, width, y*this.spacing - height/2);
		// }
		// pop();

		this.nodes.forEach(node => {
			node.draw();
		});

		this.framesSinceAnimation++;
		this.angle += (Math.PI*delta);
	}
}

function setup() {
	let canvas = createCanvas(500, 500, WEBGL);
	updateSize();

	canvas.parent('canvas-target');

	graph = new Graph(15, 40, 4, 1);

	frameRate(fps);
	noStroke();
}

function draw() {
	// Make sure that everything fits into the camera
	translate(0, 0, -zoomConstant);
	pointLight(0, 0, 255, 0, -500, 0);
	pointLight(255, 0, 0, 0, 0, 500);
	background('#edf0f1');

	graph.draw();
}

function windowResized() {
	updateSize();	
}

function updateSize() {
	size = window.innerWidth;
	console.log(size);	

	width = size;
	height = size;
	depth = size;

	resizeCanvas(width, height); 
}