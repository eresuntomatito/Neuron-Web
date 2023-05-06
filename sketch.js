// Set up properties
const canvasWidth = 800;
const canvasHeight = 800;
const neuronRadius = 8;
const maxNeurons = 1000;
const connectionThreshold = 150;
const connectionForce = 0.05;
const addNeuronInterval = 125; // in milliseconds
const activatedColor = 'blue';
const deactivatedColor = 'lightblue';
const connectionColor = 'lightblue';

// Neuron class
class Neuron {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connections = [];
    this.activated = false;
  }

  display() {
    fill(this.activated ? activatedColor : deactivatedColor);
    noStroke();
    ellipse(this.x, this.y, neuronRadius * 2);
    stroke(connectionColor);
    this.connections.forEach((other) => {
      line(this.x, this.y, other.x, other.y);
    });
  }

  update(neurons) {
    this.applyMagneticForce(neurons);
  }

  applyMagneticForce(neurons) {
    neurons.forEach((other) => {
      if (other !== this) {
        let d = dist(this.x, this.y, other.x, other.y);

        // Magnetic force and connection
        if (d < connectionThreshold) {
          let force = connectionForce * (1 - d / connectionThreshold);
          let dirX = (other.x - this.x) * force;
          let dirY = (other.y - this.y) * force;

          this.x += dirX;
          this.y += dirY;

          // Create connection if not already connected
          if (!this.connections.includes(other)) {
            this.connections.push(other);
          }
        }
      }
    });
  }
}

// Global variables
let neurons = [];
let lastNeuronAdded = 0;

// Set up the canvas
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(0);
  frameRate(60);
  neurons.push(new Neuron(width / 2, height / 2));
}

// Main draw loop
function draw() {
  background(0);

  // Add new neuron based on elapsed time
  if (millis() - lastNeuronAdded >= addNeuronInterval && neurons.length < maxNeurons) {
    let newX, newY, validPosition;
    do {
      newX = random(width);
      newY = random(height);
      validPosition = true;

      // Check for overlap with existing neurons
      neurons.forEach((neuron) => {
        if (dist(newX, newY, neuron.x, neuron.y) < neuronRadius * 2) {
          validPosition = false;
        }
      });
    } while (!validPosition);

    neurons.push(new Neuron(newX, newY));
    lastNeuronAdded = millis();
  }

  neurons.forEach((neuron) => {
    neuron.update(neurons);
    neuron.display();
  });
}

// Mouse click event handler
function mouseClicked() {
  neurons.forEach((neuron) => {
    if (dist(mouseX, mouseY, neuron.x, neuron.y) < neuronRadius) {
      neuron.activated = !neuron.activated;
    }
  });
}
